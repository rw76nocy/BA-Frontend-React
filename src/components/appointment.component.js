import React, {useEffect, useState} from "react";
import '../style/table.input.component.css';
import '../style/appointment.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

import Paper from '@mui/material/Paper';
import {
    EditingState,
    ViewState
} from '@devexpress/dx-react-scheduler';
import {Scheduler, WeekView, Toolbar, DateNavigator, Appointments, TodayButton, ViewSwitcher, MonthView, DayView, AppointmentTooltip, AppointmentForm, Resources, EditRecurrenceMenu, ConfirmationDialog} from '@devexpress/dx-react-scheduler-material-ui';
import AppointmentService from "../services/appointment.service";
import {
    IconButton,
    styled
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import {getAppointmentResources, loadAppointmentTypes} from "../utils/resources";
import "moment/locale/de";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parse from 'html-react-parser'

//TODO das hier mal nach beispiel bauen
export default function Appointment() {

    const [currentDate, setCurrentDate] = useState(Date.now);
    const [schedulerData, setSchedulerData] = useState([]);
    const [appointmentMeta, setAppointmentMeta] = useState({target : null, data : {}})
    const [visible, setVisible] = useState(false);
    const [resources, setResources] = useState([]);
    const [mainResourceName, setMainResourceName] = useState("type");
    const [livingGroup, setLivingGroup] = useState({});
    const [types, setTypes] = useState([]);

    const [addedAppointment, setAddedAppointment] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [appointmentChanges, setAppointmentChanges] = useState({});

    useEffect(async () => {
        await reloadData();
    }, [])

    const reloadData = async () => {
        let id = AuthService.getCurrentUser().id;
        const account = await Accounts.getAccountById(id);
        setLivingGroup(account.data.person.livingGroup);
        const appointments = await AppointmentService.getAppointmentsByLivingGroup(account.data.person.livingGroup.name);
        const formated = await formatAppointments(appointments.data);
        console.log("FORMATED APPOINTMENTS:", JSON.stringify(formated));
        setSchedulerData(formated);
        const types = await loadAppointmentTypes();
        setTypes(types);
    }

    const formatAppointments = async (data) => {
        let res = await getAppointmentResources();
        setResources(res);

        let copy = [...data];
        copy.map(a => {
            a.type = a.appointmentType.name;
            a.startDate = moment(a.startDate).toDate();
            a.endDate = moment(a.endDate).toDate();
            let mem = [];
            a.appointmentPersonParticipants.map(p => {
                res.map(r => {
                    if(r.fieldName === "members") {
                        r.instances.map(i => {
                            if (i.text === p.person.name) {
                                mem.push(i.id);
                            }
                        });
                    }
                });
            });
            a.members = mem;
            let chi = [];
            a.appointmentChildParticipants.map(c => {
                res.map(r => {
                    if(r.fieldName === "children") {
                        r.instances.map(i => {
                            if (i.text === c.child.fullName) {
                                chi.push(i.id);
                            }
                        });
                    }
                });
            });
            a.children = chi;
        });
        return copy;
    }

    const PREFIX = 'Demo';

    const classes = {
        container: `${PREFIX}-container`,
        text: `${PREFIX}-text`,
        button: `${PREFIX}-button`,
        addButton: `${PREFIX}-addButton`,

        content: `${PREFIX}-content`,
        header: `${PREFIX}-header`,
        closeButton: `${PREFIX}-closeButton`,
        buttonGroup: `${PREFIX}-buttonGroup`,
        picker: `${PREFIX}-picker`,
        wrapper: `${PREFIX}-wrapper`,
        icon: `${PREFIX}-icon`,
        textField: `${PREFIX}-textField`,
    };

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        [`&.${classes.button}`]: {
            color: theme.palette.background.default,
            padding: 0,
        },
    }));

    const toggleVisibility = () => {
        setVisible(!visible);
    }

    const onAppointmentMetaChange = ({target, data}) => {
        setAppointmentMeta({target: target, data: data});
    }

    const myAppointment = (props) =>  {
        return (
            <Appointment
                {...props}
                toggleVisibility={toggleVisibility}
                onAppointmentMetaChange={onAppointmentMetaChange}
            />
        );
    }

    const Appointment = ({ children, data, onClick, toggleVisibility, onAppointmentMetaChange, ...restProps }) => (
        <Appointments.Appointment
            {...restProps}
        >
            <React.Fragment>
                <StyledIconButton
                    className={classes.button}
                    onClick={({ target }) => {
                        toggleVisibility();
                        onAppointmentMetaChange({ target: target.parentElement.parentNode.parentElement.parentNode, data });
                    }}
                    size="large"
                >
                    <InfoIcon fontSize="small" />
                </StyledIconButton>
                {children}
            </React.Fragment>
        </Appointments.Appointment>
    );

    const onCurrentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
    }

    const changeAddedAppointment = (addedAppointment) => {
        /*console.log("CALL CHANGE ADDED APPOINTMENT!")
        console.log(JSON.stringify(addedAppointment));*/
        setAddedAppointment(addedAppointment);
    }

    const changeAppointmentChanges = (appointmentChanges) => {
        /*console.log("CALL CHANGE APPOINTMENT CHANGES!");
        console.log(JSON.stringify(appointmentChanges));*/
        setAppointmentChanges(appointmentChanges);
    }

    const changeEditingAppointment = (editingAppointment) => {
        /*console.log("CALL CHANGE EDIT APPOINTMENT!");
        console.log(JSON.stringify(editingAppointment));*/
        setEditingAppointment(editingAppointment);
    }

    const commitChanges = async ({ added, changed, deleted }) => {
        let data = [...schedulerData];
        console.log("DATA: "+JSON.stringify(data));
        console.log("DELETED: "+deleted);
        console.log("CHANGED:", JSON.stringify(changed));
        console.log("ADDED:", JSON.stringify(added));

        if (added) {
            if (validateAdded(added)) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                const newAppointment = buildNewAppointment({ id: startingAddedId, ...added });
                try {
                    const response = await AppointmentService.addAppointment(newAppointment);
                    toast.success(response.data.message);

                } catch (error) {
                    const errorMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message || error.toString();
                    toast.error(errorMessage);
                }

            }
        }

        if (changed) {
            if (validateChanged(changed)) {
                let change = {}
                data = data.map(appointment => {
                        if (changed[appointment.id]) {
                            change = { ...appointment, ...changed[appointment.id] };
                            return change;
                        }
                        return appointment;
                });
                try {
                    const response = await AppointmentService.updateAppointment(change);
                    toast.success(response.data.message);
                } catch (error) {
                    const errorMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message || error.toString();
                    toast.error(errorMessage);
                }
                console.log("CHANGED APPOINTMENT:", JSON.stringify(change));
            }
        }

        if (deleted !== undefined) {
            data = data.filter(appointment => appointment.id !== deleted);
            try {
                const response = await AppointmentService.deleteAppointment(deleted);
                toast.success(response.data.message);
            } catch (error) {
                const errorMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message || error.toString();
                toast.error(errorMessage);
            }
        }

        console.log("NEW DATA:",JSON.stringify(data));
        setSchedulerData(data);
    }

    const validateAdded = (added) => {
        let errors = [];
        if (!added.title || added.title === "") {
            errors.push("Titel muss angeben werden!");
        }

        if (!added.type) {
            errors.push("Terminart muss angeben werden!");
        }

        if (!added.members || added.members[0] === undefined) {
            errors.push("Mindestens ein Teilnehmer muss ausgewählt werden!");
        }

        if (errors.length === 0) {
            toast.success("Termin erfolgreich angelegt!")
            return true;
        }

        toast.error(formatErrorMessage(errors));
        return false;
    }

    const validateChanged = (changed) => {
        let errors = [];
        let change_id = Object.keys(changed)[0];
        let obj = changed[change_id];


        if (obj.title && obj.title === "") {
            errors.push("Titel muss angeben werden!");
        }

        if (obj.members && obj.members.length === 0) {
            errors.push("Mindestens ein Teilnehmer muss ausgewählt werden!");
        }

        if (errors.length === 0) {
            return true;
        }

        toast.error(formatErrorMessage(errors));
        return false;
    }

    const formatErrorMessage = (errors) => {
        let message = "<b>Fehler</b><br/><br/>"
        message = message.concat("<ul>")
        errors.map(error => {
            message = message.concat("<li>");
            message = message.concat(error);
            message = message.concat("</li>");
        });
        message = message.concat("</ul>")
        console.log(message);
        return <div>{parse(message)}</div>
    }

    const buildNewAppointment = (added) => {
        let appointment = added;

        appointment.livingGroup = livingGroup;
        appointment.appointmentType = types.find(t => t.name === added.type);
        if (appointment.children === undefined || !appointment.children[0]) {
            appointment.children = [];
        }

        console.log("ALL TYPES:", JSON.stringify(types));
        console.log("NEW BUILDED APPOINTMENT:", JSON.stringify(appointment));
        return appointment;
    }

    const todayText = {
        today: 'Heute'
    };

    const confirmationMessages = {
        cancelButton: 'Abbrechen',
        deleteButton: 'Entfernen',
        confirmDeleteMessage: 'Bist du dir sicher, dass du diesen Termin entfernen willst?'
    };

    const recurrenceMessages = {
        current: 'Dieser Termin',
        currentAndFollowing: 'Dieser und folgende Termine',
        all: 'Alle Termine',
        menuEditingTitle: 'Bearbeite wiederholende Termine',
        menuDeletingTitle: 'Lösche wiederholende Termine',
        cancelButton: 'Abbrechen',
        commitButton: 'Ok'
    }

    const appointmentFormMessages = {
        detailsLabel: "Titel",
        commitCommand: "Speichern",
        repeatLabel: "Wiederholung",
        daily: "täglich",
        weekly: "wöchentlich",
        monthly: "monatlich",
        yearly: "jährlich",
        repeatEveryLabel: "wdh. alle",
        daysLabel: "Tag(e)",
        weeksOnLabel: "Woche(n) am:",
        monthsLabel: "Monat(e)",
        endRepeatLabel: "Ende der Wiederholung",
        afterLabel: "bis",
        never: "niemals",
        onLabel: "für",
        occurrencesLabel: "Vorkommen",
        ofEveryMonthLabel: ". jeden Monats",
        theLabel: "den",
        firstLabel: "Ersten",
        secondLabel: "Zweiten",
        thirdLabel: "Dritten",
        fourthLabel: "Vierten",
        lastLabel: "Letzten",
        everyLabel: "jeden",
        yearsLabel: "Jahr(e)",
        ofLabel: "im"
    }

    return(
        <div className="children-container">
            <div className="title">
                <h1><u>Übersicht Termine </u></h1>
            </div>
            <div className="appointment-container">
                <div className="appointment-right">
                    <div>
                        <ToastContainer position="bottom-center"/>
                    </div>
                    <Paper>
                        <Scheduler data={schedulerData} firstDayOfWeek={1} locale={"de-DE"}>
                            <ViewState currentDate={currentDate} onCurrentDateChange={onCurrentDateChange}/>
                            <EditingState
                                onCommitChanges={commitChanges}
                                //addedAppointment={addedAppointment}
                                onAddedAppointmentChange={changeAddedAppointment}
                                //appointmentChanges={appointmentChanges}
                                onAppointmentChangesChange={changeAppointmentChanges}
                                //editingAppointment={editingAppointment}
                                onEditingAppointmentChange={changeEditingAppointment}
                            />
                            <EditRecurrenceMenu messages={recurrenceMessages} />
                            <ConfirmationDialog messages={confirmationMessages} ignoreCancel/>
                            <WeekView startDayHour={7} endDayHour={20} displayName={"Woche"}/>
                            <MonthView displayName={"Monat"} />
                            <DayView startDayHour={7} endDayHour={20} displayName={"Tag"} />
                            <Toolbar />
                            <DateNavigator />
                            <TodayButton messages={todayText}/>
                            <ViewSwitcher />
                            <Appointments appointmentComponent={myAppointment} />
                            <AppointmentTooltip
                                showCloseButton
                                showOpenButton
                                showDeleteButton
                                visible={visible}
                                onVisibilityChange={toggleVisibility}
                                appointmentMeta={appointmentMeta}
                                onAppointmentMetaChange={onAppointmentMetaChange}
                            />
                            <AppointmentForm
                                messages={appointmentFormMessages}
                            />
                            <Resources
                                data={resources}
                                mainResourceName={mainResourceName}
                            />
                        </Scheduler>
                    </Paper>
                </div>
            </div>
        </div>
    );
}