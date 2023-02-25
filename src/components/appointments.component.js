import React, {useEffect, useRef, useState} from "react";
import '../style/table.input.component.css';
import '../style/appointment.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

import Paper from '@mui/material/Paper';
import {EditingState, ViewState} from '@devexpress/dx-react-scheduler';
import {
    AppointmentForm,
    Appointments,
    AppointmentTooltip,
    ConfirmationDialog,
    DateNavigator,
    DayView,
    EditRecurrenceMenu,
    MonthView,
    Resources,
    Scheduler,
    TodayButton,
    Toolbar,
    ViewSwitcher,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import AppointmentService from "../services/appointment.service";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {getAppointmentResources, loadAppointmentTypes} from "../utils/resources";
import "moment/locale/de";
import moment from "moment";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parse from 'html-react-parser'
import {handleError, isAfter, isDateValid} from "../utils/utils";
import Box from "@mui/material/Box";
import {
    BasicLayout,
    BooleanEditor,
    DateEditor,
    Label,
    ResourceEditor,
    TextEditor
} from "./appointment.editor.components";
import {classes, StyledFab, StyledIconButton} from "./appointment.style.helper";
import {appointmentFormMessages, confirmationMessages, recurrenceMessages, todayText} from "./appointment.messages";
import {renderOverlapTable} from "./appointment.overlap.helper";
import {renderAlternativeTable} from "./appointment.alternative.helper";

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
    const [alternativeChoice, setAlternativeChoice] = useState("edit");
    const addedApp = useRef({});
    const over = useRef([]);
    const alternatives = useRef([]);

    useEffect(async () => {
        try {
            const response = await reloadData();
        } catch (error) {
            handleError(error);
        }

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

        if (added) {
            if (validateAdded(added)) {
                const newAppointment = buildNewAppointment({ id: 0, ...added });
                try {
                    const response = await AppointmentService.checkOverlaps(newAppointment);

                    if (response.data[0] !== undefined) {
                        addedApp.current = newAppointment;
                        over.current = response.data;
                        toggleConfirmationVisible();
                    } else {
                        const response = await AppointmentService.addAppointment(newAppointment);
                        setCurrentAppointment({});
                        newAppointment.id = response.data.id;
                        data = [...data, newAppointment];
                        toast.success(response.data.message);
                    }
                } catch (error) {
                    handleError(error);
                }
            }
        }

        if (changed) {
            if (validateChanged(changed)) {
                let filtered = data.filter(appointment => changed[appointment.id])[0];
                let change = {...filtered, ...changed[filtered.id]};
                change.livingGroup = livingGroup;

                try {
                    const response = await AppointmentService.checkOverlaps(change);

                    if (response.data[0] !== undefined) {
                        addedApp.current = change;
                        over.current = response.data;
                        toggleConfirmationVisible();
                    } else {
                        const response = await AppointmentService.updateAppointment(change);
                        setCurrentAppointment({});
                        data = data.map(appointment => {
                            if (changed[appointment.id]) {
                                change = { ...appointment, ...changed[appointment.id] };
                                return change;
                            }
                            return appointment;
                        });
                        toast.success(response.data.message);
                    }
                } catch (error) {
                    handleError(error);
                }
            }
        }

        if (deleted !== undefined) {
            data = data.filter(appointment => appointment.id !== deleted);
            try {
                const response = await AppointmentService.deleteAppointment(deleted);
                toast.success(response.data.message);
            } catch (error) {
                handleError(error);
            }
        }

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
        let change1 = data.filter(appointment => changed[appointment.id ])[0];
        let change2 = {...change1, ...changed[change1.id]};

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

        if (!isAfter(change2.endDate, change2.startDate)) {
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
        return <div>{parse(message)}</div>
    }

    const buildNewAppointment = (added) => {
        let appointment = added;

        appointment.livingGroup = livingGroup;
        appointment.appointmentType = types.find(t => t.name === added.type);
        if (appointment.children === undefined || !appointment.children[0]) {
            appointment.children = [];
        }
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
            handleError(error);
        }
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

    const onCancelConfirmation = () => {
        addedApp.current = {};
        over.current = [];
        setCurrentAppointment({});
        setConfirmChoice("keep");
        toggleConfirmationVisible();
    }

    const executeConfirmationChoice = async () => {
        if (confirmChoice === "keep") {
            await commitAddedAppointment();
            await toggleConfirmationVisible();
        }
        if (confirmChoice === "edit") {
            setCurrentAppointment(addedApp.current);
            setEditingFormVisible(true);
            toggleConfirmationVisible();
        }
        if (confirmChoice === "altBefore") {
            try {
                const alts = await AppointmentService.getEarlierAlternatives(addedApp.current);
                alternatives.current = alts.data;
                setConfirmChoice("keep");
                setAlternativeChoice("edit");
                toggleConfirmationVisible();
                toggleAlternativeVisible();
            } catch (error) {
                handleError(error);
            }
        }
        if (confirmChoice === "altAfter") {
            try {
                const alts = await AppointmentService.getLaterAlternatives(addedApp.current);
                alternatives.current = alts.data;
                setConfirmChoice("keep");
                setAlternativeChoice("edit");
                toggleConfirmationVisible();
                toggleAlternativeVisible();
            } catch (error) {
                handleError(error);
            }
        }
    }

    const alternativeDialogContent = () => {
        if (alternatives.current.length === 0) {
            return (
                <div>
                    <DialogContentText>
                        Es konnten keine Alternativen gefunden werden.
                    </DialogContentText>
                    <br/>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="edit"
                            name="radio-buttons-group"
                            value={alternativeChoice}
                            onChange={onChangeAlternativeChoice}
                        >
                            <FormControlLabel value="edit" control={<Radio />} label="Termin manuell bearbeiten" />
                        </RadioGroup>
                    </FormControl>
                </div>
            );
        }
        return (
            <div>
                <DialogContentText>
                    Es wurden folgende Alternativen gefunden.
                </DialogContentText>
                <br/>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="edit"
                        name="radio-buttons-group"
                        value={alternativeChoice}
                        onChange={onChangeAlternativeChoice}
                    >
                        {alternatives.current.length !== 0 &&
                            alternatives.current.map(alt => {
                                return (
                                    <FormControlLabel
                                        value={alternatives.current.indexOf(alt)}
                                        control={<Radio />}
                                        label={renderAlternativeTable(alt)}
                                    />
                                );
                            })
                        }
                        <FormControlLabel value="edit" control={<Radio />} label="Termin manuell bearbeiten" />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }

    const onChangeAlternativeChoice = (e) => {
        setAlternativeChoice(e.target.value);
    }

    const onCancelAlternative = () => {
        addedApp.current = {};
        over.current = [];
        setCurrentAppointment({});
        toggleAlternativeVisible();
    }

    const formatAddedApp = (added) => {
        const newAppointment = {...added};
        newAppointment.startDate = moment(added.startDate).toDate();
        newAppointment.endDate = moment(added.endDate).toDate();
        newAppointment.type = added.appointmentType.name;
        addedApp.current = newAppointment;
    }

    const executeAlternativeChoice = async () => {
        if (alternativeChoice === "edit") {
            setCurrentAppointment(addedApp.current);
            setEditingFormVisible(true);
            toggleAlternativeVisible();
        } else {
            const added = alternatives.current[alternativeChoice];
            if (added) {
                try {
                    formatAddedApp(added);
                    await commitAddedAppointment();
                    await toggleAlternativeVisible();
                } catch (error) {
                    handleError(error);
                }
            }
        }
    }

    return(
        <div className="children-container">
            <div className="title">
                <h1><u>Übersicht Termine </u></h1>
            </div>
            <div className="appointment-container">
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
                            <Button onClick={onCancelConfirmation} color="primary" variant="outlined">
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
                            {alternativeDialogContent()}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onCancelAlternative} color="primary" variant="outlined">
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
                        onClick={async () => {
                            await onEditingAppointmentChange(undefined);
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