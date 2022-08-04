import React, {useEffect, useRef, useState} from "react";
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
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, FormControlLabel,
    Radio, RadioGroup,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {getAppointmentResources, loadAppointmentTypes} from "../utils/resources";
import "moment/locale/de";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parse from 'html-react-parser'
import {isAfter, isDateValid} from "../utils/utils";
import Box from "@mui/material/Box";
import {DateEditor, TextEditor, BooleanEditor, Label, ResourceEditor, BasicLayout} from "./appointment.editor.components";
import {classes, StyledIconButton, StyledFab} from "./appointment.style.helper";
import {todayText, confirmationMessages, recurrenceMessages, appointmentFormMessages} from "./appointment.messages";
import {renderOverlapTable} from "./appointment.overlap.helper";

export default function Appointment() {

    const [currentDate, setCurrentDate] = useState(Date.now);
    const [schedulerData, setSchedulerData] = useState([]);
    const [appointmentMeta, setAppointmentMeta] = useState({target : null, data : {}})
    const [visible, setVisible] = useState(false);
    const [resources, setResources] = useState([]);
    const [mainResourceName, setMainResourceName] = useState("type");
    const [livingGroup, setLivingGroup] = useState({});
    const [types, setTypes] = useState([]);

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [alternativeVisible, setAlternativeVisible] = useState(false);

    const [editingFormVisible, setEditingFormVisible] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [currentAppointment, setCurrentAppointment] = useState({});

    const [confirmChoice, setConfirmChoice] = useState("keep");
    const addedApp = useRef({});
    const over = useRef([]);

    useEffect(async () => {
        const response = await reloadData();
    }, [])

    useEffect(() => {
        if (editingAppointment === undefined) {
            setCurrentAppointment({});
        } else {
            setCurrentAppointment(editingAppointment);
        }
    }, [editingAppointment]);

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

    const commitChanges = async ({ added, changed, deleted }) => {
        let data = [...schedulerData];
        console.log("DATA: "+JSON.stringify(data));
        console.log("DELETED: "+deleted);
        console.log("CHANGED:", JSON.stringify(changed));
        console.log("ADDED:", JSON.stringify(added));

        const start = new Date().getTime();

        if (added) {
            const start1 = new Date().getTime();
            if (validateAdded(added)) {
                const newAppointment = buildNewAppointment({ id: 0, ...added });
                try {
                    //TODO die zeitmessung dann wieder raus!
                    const start2 = new Date().getTime();

                    const response = await AppointmentService.checkOverlaps(newAppointment);

                    const end2 = new Date().getTime();
                    console.log("Check Overlap time: ", end2-start2);
                    console.log("RESPONSE DATA: ", JSON.stringify(response.data));

                    if (response.data[0] !== undefined) {
                        addedApp.current = newAppointment;
                        over.current = response.data;
                        toggleConfirmationVisible();
                    } else {
                        //TODO die zeitmessung dann wieder raus!
                        const start3 = new Date().getTime();

                        const response = await AppointmentService.addAppointment(newAppointment);
                        setCurrentAppointment({});

                        const end3 = new Date().getTime();
                        console.log("Add appointment time: ", end3-start3);

                        newAppointment.id = response.data.id;
                        data = [...data, newAppointment];
                        toast.success(response.data.message);
                    }
                } catch (error) {
                    toastError(error);
                }
            }
            //TODO die zeitmessung dann wieder raus!
            const end1 = new Date().getTime();
            console.log("Duration Added: ", end1-start1);
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
                    //TODO detect intersection on change
                    // da dann das selbe wie beim adden machen???
                    const response = await AppointmentService.updateAppointment(change);
                    toast.success(response.data.message);
                } catch (error) {
                    toastError(error);
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
                toastError(error);
            }
        }

        //TODO die zeitmessung dann wieder raus!
        const end = new Date().getTime();
        const duration = "Duration Commit Changes: "+String(end-start)+" ms";
        toast.success(duration);

        console.log("NEW DATA:",JSON.stringify(data));
        setSchedulerData(data);
    }

    const validateAdded = (added) => {
        let errors = [];
        if (!added.title || added.title === "") {
            errors.push("Titel muss angeben werden!");
        }

        if (!added.startDate || !isDateValid(added.startDate)) {
            errors.push("Der Startzeitpunkt ist ungültig!");
        }

        if (!added.endDate || !isDateValid(added.endDate)) {
            errors.push("Der Endzeitpunkt ist ungültig!");
        }

        if (!isAfter(added.endDate, added.startDate)) {
            errors.push("Der Endzeitpunkt liegt vor dem Startzeitpunkt!");
        }

        if (!added.type) {
            errors.push("Terminart muss angeben werden!");
        }

        if (!added.members || added.members[0] === undefined) {
            errors.push("Mindestens ein Teilnehmer muss ausgewählt werden!");
        }

        if (errors.length === 0) {
            return true;
        }

        toast.error(formatErrorMessage(errors));
        return false;
    }

    const validateChanged = (changed) => {
        let errors = [];
        let change_id = Object.keys(changed)[0];
        let obj = changed[change_id];

        let data = [...schedulerData];
        let change = data.map(appointment => {
            if (changed[appointment.id]) {
                return { ...appointment, ...changed[appointment.id] };
            }
        });


        if (obj.title && obj.title === "") {
            errors.push("Titel muss angeben werden!");
        }

        if (obj.startDate) {
            if (!isDateValid(obj.startDate)) {
                errors.push("Der Startzeitpunkt ist ungültig!");
            }
        }

        if (obj.endDate) {
            if (!isDateValid(obj.endDate)) {
                errors.push("Der Endzeitpunkt ist ungültig!");
            }
        }

        if (!isAfter(change.endDate, change.startDate)) {
            errors.push("Der Endzeitpunkt liegt vor dem Startzeitpunkt!");
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

    const toastError = (error) => {
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString();
        toast.error(errorMessage);
    }

    const buildNewAppointment = (added) => {
        let appointment = added;

        appointment.livingGroup = livingGroup;
        appointment.appointmentType = types.find(t => t.name === added.type);
        if (appointment.children === undefined || !appointment.children[0]) {
            appointment.children = [];
        }
        console.log("NEW BUILDED APPOINTMENT:", JSON.stringify(appointment));
        return appointment;
    }

    const toggleConfirmationVisible = () => {
        setConfirmationVisible(!confirmationVisible);
    }

    const toggleAlternativeVisible = () => {
        setAlternativeVisible(!alternativeVisible);
    }

    const commitAddedAppointment = async () => {
        let data = [...schedulerData];
        let newAppointment = addedApp.current;

        try {
            const response = await AppointmentService.addAppointment(newAppointment);
            newAppointment.id = response.data.id;
            toast.success(response.data.message);
            data = [...data, newAppointment];
            setSchedulerData(data);
        } catch (error) {
            toastError(error);
        }

        toggleConfirmationVisible();
    }

    const onEditingAppointmentChange = (editingAppointment) => {
        setEditingAppointment(editingAppointment);
    }

    const toggleEditingFormVisibility = () => {
        setEditingFormVisible(!editingFormVisible);
    }

    const temporalOverlapsDialogContent = () => {
        return (
            <div>
                <span>Es wurden zeitliche Überschneidungen festgestellt.</span>
                <br/>
                <br/>
                <Box style={{overflowY: "auto", maxHeight: "260px", display: "flex", flexGrow: 1, flexDirection: "column"}}>
                    {over.current.map(o => renderOverlapTable(o))}
                </Box>
                <br/>
                <span>
                    Wollen Sie den Termin trotzdem anlegen, bearbeiten oder soll nach einer Alternative gesucht werden?
                </span>
                <br/>
                <br/>
                <span>
                    Sie können eine Alternative für einen früheren oder späteren Zeitraum suchen.
                </span>
            </div>
        );
    }

    const onChangeConfirmChoice = (e) => {
        setConfirmChoice(e.target.value);
    }

    const executeConfirmationChoice = async () => {
        if (confirmChoice === "keep") {
            await commitAddedAppointment();
        }
        if (confirmChoice === "edit") {
            setCurrentAppointment(addedApp.current);
            setEditingFormVisible(true);
            toggleConfirmationVisible();
        }
        if (confirmChoice === "altBefore") {
            //TODO hier dann die nächsten 5 alternative davor suchen und in einem extra dialog anzeigen und auswählbar machen!
            // in den grenzen von 7-20 Uhr
            // es kann auch keine alternativen in diesem zeitraum geben, in dem fall dann eben manuelles bearbeiuten ermöglichen!
            console.log("ALTERNATIVE: ich suche dann jetzt mal Alternativen davor für dich!");
            toggleConfirmationVisible();
            toggleAlternativeVisible();
        }
        if (confirmChoice === "altAfter") {
            //TODO hier dann die nächsten 5 alternative danach suchen und in einem extra dialog anzeigen und auswählbar machen!
            // in den grenzen von 7-20 Uhr
            // es kann auch keine alternativen in diesem zeitraum geben, in dem fall dann eben manuelles bearbeiuten ermöglichen!
            console.log("ALTERNATIVE: ich suche dann jetzt mal Alternativen danach für dich!");
            toggleConfirmationVisible();
            toggleAlternativeVisible();
        }
    }

    const executeAlternativeChoice = () => {

    }

    return(
        <div className="children-container">
            <div className="title">
                <h1><u>Übersicht Termine </u></h1>
            </div>
            <div className="appointment-container">
                <div>
                    <ToastContainer position="bottom-center" autoClose={15000}/>
                </div>
                <Paper>
                    <Scheduler data={schedulerData} firstDayOfWeek={1} locale={"de-DE"}>
                        <ViewState currentDate={currentDate} onCurrentDateChange={onCurrentDateChange}/>
                        <EditingState
                            onCommitChanges={commitChanges}
                            editingAppointment={editingAppointment}
                            onEditingAppointmentChange={onEditingAppointmentChange}
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
                            basicLayoutComponent={BasicLayout}
                            resourceEditorComponent={ResourceEditor}
                            dateEditorComponent={DateEditor}
                            textEditorComponent={TextEditor}
                            booleanEditorComponent={BooleanEditor}
                            labelComponent={Label}
                            visible={editingFormVisible}
                            onVisibilityChange={toggleEditingFormVisibility}
                            appointmentData={currentAppointment}
                        />
                        <Resources
                            data={resources}
                            mainResourceName={mainResourceName}
                        />
                    </Scheduler>

                    {/*//TODO Konflikt-Dialog*/}
                    <Dialog
                        open={confirmationVisible}
                    >
                        <DialogTitle>
                            Terminkonflikt
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {temporalOverlapsDialogContent()}
                            </DialogContentText>
                            <br/>
                            <div>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="keep"
                                        name="radio-buttons-group"
                                        value={confirmChoice}
                                        onChange={onChangeConfirmChoice}
                                    >
                                        <FormControlLabel value="keep" control={<Radio />} label="Termin beibehalten" />
                                        <FormControlLabel value="edit" control={<Radio />} label="Termin bearbeiten" />
                                        <FormControlLabel value="altBefore" control={<Radio />} label="Frühere Alternativen suchen" />
                                        <FormControlLabel value="altAfter" control={<Radio />} label="Spätere Alternativen suchen" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={toggleConfirmationVisible} color="primary" variant="outlined">
                                Abbrechen
                            </Button>
                            <Button onClick={executeConfirmationChoice} color="secondary" variant="outlined">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/*//TODO Alternative-Dialog*/}
                    <Dialog
                        open={alternativeVisible}
                    >
                        <DialogTitle>
                            Terminalternativen
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Hier könnten ihre Terminalternativen stehen!
                                {/*{temporalOverlapsDialogContent()}*/}
                            </DialogContentText>
                            <br/>
                            <div>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="keep"
                                        name="radio-buttons-group"
                                        /*value={confirmChoice}
                                        onChange={onChangeConfirmChoice}*/
                                    >
                                        <FormControlLabel value="app1" control={<Radio />} label={
                                            "Alternative 1"
                                            /*//TODO ja hier dann eben die Alternative in ne Komponente packen!*/
                                            /*<div>
                                                <span>Lalala in bin</span>
                                                <br/>
                                                <span>das DIV von</span>
                                                <br/>
                                                <span>Radio 1</span>
                                            </div>*/
                                        } />
                                        <FormControlLabel value="app2" control={<Radio />} label="Alternative 2" />
                                        <FormControlLabel value="app3" control={<Radio />} label="Alternative 3" />
                                        <FormControlLabel value="app4" control={<Radio />} label="Alternative 4" />
                                        <FormControlLabel value="edit" control={<Radio />} label="Termin manuell bearbeiten" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={toggleAlternativeVisible} color="primary" variant="outlined">
                                Abbrechen
                            </Button>
                            <Button onClick={executeAlternativeChoice} color="secondary" variant="outlined">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <StyledFab
                        color="secondary"
                        className={classes.addButton}
                        onClick={() => {
                            onEditingAppointmentChange(undefined);
                            setEditingFormVisible(true);
                        }}
                    >
                        <AddIcon />
                    </StyledFab>
                </Paper>
            </div>
        </div>
    );
}