import React, {useEffect, useMemo, useState} from "react";
import '../style/table.input.component.css';
import '../style/appointment.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

import AppointmentInput from "./appointment.input";
import Paper from '@mui/material/Paper';
import {
    EditingState,
    ViewState
} from '@devexpress/dx-react-scheduler';
import {Scheduler, WeekView, Toolbar, DateNavigator, Appointments, TodayButton, ViewSwitcher, MonthView, DayView, AppointmentTooltip, AppointmentForm, Resources, EditRecurrenceMenu, ConfirmationDialog} from '@devexpress/dx-react-scheduler-material-ui';
import LivingGroups from "../services/living.group.service";
import AppointmentService from "../services/appointment.service";
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Fab, FormLabel,
    Grid,
    IconButton,
    MenuItem,
    Popover,
    Select,
    styled
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {getAppointmentResources, loadAppointmentTypes} from "../utils/resources";
import AdapterMoment from "@mui/lab/AdapterMoment";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import "moment/locale/de";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parse from 'html-react-parser'

import {ModalDialog} from "react-bootstrap";
import {CalendarToday, Close, Create, LocationOn, Notes} from "@material-ui/icons";
import {connectProps} from "@devexpress/dx-react-core";

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
    const [addedAppointment, setAddedAppointment] = useState({});
    const [editingFormVisible, setEditingFormVisible] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(undefined);
    const [previousAppointment, setPreviousAppointment] = useState(undefined);
    const [isNewAppointment, setIsNewAppointment] = useState(false);
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

    //TODO mal aufheben für später!
    /*const StyledDiv = styled('div')(({ theme }) => ({
        [`&.${classes.container}`]: {
            display: 'flex',
            marginBottom: theme.spacing(2),
            justifyContent: 'flex-end',
        },
        [`& .${classes.text}`]: {
            ...theme.typography.h6,
            marginRight: theme.spacing(2),
        },
    }));*/

    //TODO mal aufheben für später!
    /*const ResourceSwitcher = (
        ({
             mainResourceName, onChange, resources,
         }) => (
            <StyledDiv className={classes.container}>
                <div className={classes.text}>
                    Main resource name:
                </div>
                <Select
                    variant="standard"
                    value={mainResourceName}
                    onChange={e => onChange(e.target.value)}
                >
                    {resources.map(resource => (
                        <MenuItem key={resource.fieldName} value={resource.fieldName}>
                            {resource.title}
                        </MenuItem>
                    ))}
                </Select>
            </StyledDiv>
        )
    );*/

    const StyledDiv = styled('div')(({ theme }) => ({
        [`& .${classes.icon}`]: {
            margin: theme.spacing(2, 0),
            marginRight: theme.spacing(2),
        },
        [`& .${classes.header}`]: {
            overflow: 'hidden',
            paddingTop: theme.spacing(0.5),
        },
        [`& .${classes.textField}`]: {
            width: '100%',
        },
        [`& .${classes.content}`]: {
            padding: theme.spacing(2),
            paddingTop: 0,
        },
        [`& .${classes.closeButton}`]: {
            float: 'right',
        },
        [`& .${classes.picker}`]: {
            marginRight: theme.spacing(2),
            '&:last-child': {
                marginRight: 0,
            },
            width: '50%',
        },
        [`& .${classes.wrapper}`]: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: theme.spacing(1, 0),
        },
        [`& .${classes.buttonGroup}`]: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 2),
        },
        [`& .${classes.button}`]: {
            marginLeft: theme.spacing(2),
        },
    }));

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        [`&.${classes.button}`]: {
            color: theme.palette.background.default,
            padding: 0,
        },
    }));

    const StyledFab = styled(Fab)(({ theme }) => ({
        [`&.${classes.addButton}`]: {
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(4),
        },
    }));

    const toggleVisibility = () => {
        setVisible(!visible);
    }

    const onAppointmentMetaChange = ({target, data}) => {
        console.log("APPOINTMENT META CHANGED!")
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

    //TODO ja irgendwie wird der immer neu gerendert
    const TextEditor = (props) => {
        console.log("RENDER TEXT EDITOR!");
        if (props.type === 'multilineTextEditor') {
            return null;
        }

        return <AppointmentForm.TextEditor  {...props} />;
    }

    const DateEditor = React.memo(
        ({
             onValueChange,
             value,
             readOnly,
             className,
             locale,
             excludeTime,
             ...restProps
         }) => {
            const memoizedChangeHandler = React.useCallback(
                (nextDate) => nextDate && onValueChange(nextDate.toDate()),
                [onValueChange]
            );
            const dateFormat = excludeTime ? "DD/MM/YYYY" : "DD/MM/YYYY HH:mm";

            return (
                <LocalizationProvider dateAdapter={AdapterMoment} locale={locale}>
                    <DateTimePicker
                        disabled={readOnly}
                        renderInput={(props) => (
                            <TextField className={className} margin="normal" {...props} />
                        )}
                        value={value}
                        onChange={memoizedChangeHandler}
                        inputFormat={dateFormat}
                        {...restProps}
                    />
                </LocalizationProvider>
            );
        }
    );

    const BooleanEditor = (props) => {
        if (props.label === 'All Day') {
            return null;
        }
        return <AppointmentForm.BooleanEditor {...props} />
    }

    const Label = (props) => {
        if (props.text === 'More Information') {
            return null;
        }
        return <AppointmentForm.Label {...props} />
    }

    const ResourceEditor = (props) => {
        if (props.resource.fieldName === 'location') {
            return null;
        }
        return <AppointmentForm.ResourceEditor {...props} />
    }

    const BasicLayout = React.memo(({ onFieldChange, appointmentData, ...restProps }) => {

        console.log("RENDER BASIC LAYOUT!");

        const onCustomFieldChange = (nextValue) => {
            onFieldChange({ location: nextValue });
        };

        /*const onTitleFieldChange = (nextValue) => {
            onFieldChange({ title: nextValue});
        };*/

        return (
            <AppointmentForm.BasicLayout
                appointmentData={appointmentData}
                onFieldChange={onFieldChange}
                {...restProps}
            >
                <AppointmentForm.Label
                    text="Ort"
                    type="title"
                />
                <AppointmentForm.TextEditor
                    type="ordinaryTextEditor"
                    value={appointmentData.location}
                    onValueChange={onCustomFieldChange}
                    placeholder="Ort"
                    readOnly={false}
                />
            </AppointmentForm.BasicLayout>
        );
    });

    /*const isDataValid = (data) => data.title;

    const CommandButton = React.useCallback((props) => {
            const { id } = props;
            console.log("PROPS-ID", id);
            if (id !== "saveButton") {
                return <AppointmentForm.CommandButton {...props} />;
            }
            //TODO ja der scheiß geht hinten und vorne nicht!!!!! scheiß foren gequatsche von irgendwelchen wichsern!!!!
            console.log("EDITING APPOINTMENT:", JSON.stringify(editingAppointment));
            const nextData = editingAppointment ? { ...editingAppointment, ...appointmentChanges } : addedAppointment;
            console.log("NEXT DATA:", JSON.stringify(nextData));
            const isValid = isDataValid(nextData);
            const onExecute = isValid ? props.onExecute : () => alert("Titel ist ungültig");
            return <AppointmentForm.CommandButton {...props} onExecute={onExecute} />;
        },
        [addedAppointment, appointmentChanges, editingAppointment]
    );*/

    //TODO mal aufheben für später!
    /*const onChangeMainResource = (e) => {
        console.log("Change Resource Name: "+e);
        setMainResourceName(e);
    }*/

    const onCurrentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
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
                    //TODO detect intersection
                    setAddedAppointment(newAppointment);
                    toggleConfirmationVisible();

                } catch (error) {
                    const errorMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message || error.toString();
                    toast.error(errorMessage);
                }

            }
        }

        if (changed) {
            //TODO validierung? sonst nicht ändern
            if (validateChanged(changed)) {
                //data = data.map(appointment => (changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
                let change = {}
                data = data.map(appointment => {
                        if (changed[appointment.id]) {
                            change = { ...appointment, ...changed[appointment.id] };
                            return change;
                        }
                        return appointment;
                });
                try {
                    //TODO detect intersection

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

        //TODO soweit fertig!
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

    const toggleConfirmationVisible = () => {
        setConfirmationVisible(!confirmationVisible);
    }

    const commitAddedAppointment = async () => {
        let data = [...schedulerData];
        console.log("ADDED APPOINTMENT",JSON.stringify(addedAppointment));
        let newAppointment = addedAppointment;
        console.log("NEW APPOINTMENT",JSON.stringify(newAppointment));
        const response = await AppointmentService.addAppointment(newAppointment);
        toast.success(response.data.message);
        data = [...data, newAppointment];
        setSchedulerData(data);
        setAddedAppointment({});
        toggleConfirmationVisible();
        printSettings();
    }

    const onEditingAppointmentChange = (editingAppointment) => {
        console.log("CALL ON EDIT APPOINTMENT CHANGE!");
        console.log(JSON.stringify(editingAppointment));
        setEditingAppointment(editingAppointment);
    }

    /*const onAddedAppointmentChange = React.useCallback((appointment) => {
        setAddedAppointment(appointment);
    },[addedAppointment]);*/

    const onAddedAppointmentChange = (addedApp) => {
        console.log("CALL ON ADDED APPOINTMENT CHANGE!")
        /*console.log("CALL ON ADDED APPOINTMENT CHANGE!")
        console.log(addedAppointment);
        const added = {...addedAppointment, ...addedApp};
        console.log(JSON.stringify(added));
        setAddedAppointment(added);
        let editAppoint = editingAppointment;
        if (editAppoint !== undefined) {
            setPreviousAppointment(editAppoint);
        }
        setEditingAppointment(undefined);
        setIsNewAppointment(true);
        printSettings();*/
        console.log("ADDED APP:", JSON.stringify(addedApp));
        let nA = {...addedAppointment, ...addedApp};
        console.log("nA:", JSON.stringify(nA));
        //TODO hmm geht das nun etwa?!!!
        setAppointmentChanges(nA);
        //setAddedAppointment(nA);
    }

    const onChangeAppointmentChanges = (appointmentChanges) => {
        console.log("CALL ON CHANGE APPOINTMENT CHANGEs!");
        console.log(JSON.stringify(appointmentChanges));
        //setAppointmentChanges(appointmentChanges);
    }

    const currentAppointment = () => {
            console.log("CALL CURRENT APPOINTMENT!");
            console.log("editingAppointment:", JSON.stringify(editingAppointment));
            //console.log("addedAppointment", JSON.stringify(addedAppointment));
            let appointment = schedulerData.filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0] || addedAppointment;
            console.log("appointment", JSON.stringify(appointment));
            /*if (JSON.stringify(appointment) === "{}") {
                //TODO sobald man was ändert übernimmt er die zeiten nicht -.-
                return {
                    startDate: new Date(new Date(Date.now()).setHours(9,0)),
                    endDate: new Date(new Date(Date.now()).setHours(10,0)),
                }
            }*/
            return appointment;
        };

    /*const defaultAddedAppointment = React.useCallback(() => {
        console.log("CALL DEFAULT ADDED APPOINTMENT CALLBACK!")
        let appointment = {
            startDate: new Date(new Date(Date.now()).setHours(9,0)),
            endDate: new Date(new Date(Date.now()).setHours(10,0)),
        }
        //setAddedAppointment(appointment);
        return appointment;
    },[editingAppointment, addedAppointment]);*/

    const printSettings = () => {
        console.log("confirmationVisible", confirmationVisible);
        console.log("editingFormVisible", editingFormVisible);
        console.log("isNewAppointment", isNewAppointment);
        console.log("addedAppointment", JSON.stringify(addedAppointment));
        console.log("editingAppointment", JSON.stringify(editingAppointment));
        console.log("appointmentChanges", JSON.stringify(appointmentChanges));
    }

    const toggleEditingFormVisibility = () => {
        setEditingFormVisible(!editingFormVisible);
    }

    /*const changeAppointment = ({field, changes}) => {
        console.log("CALL CHANGE APPOINTMENT!")
        const nextChanges = {...appointmentChanges, [field]: changes,};
        setAppointmentChanges(nextChanges);
    }*/

    //TODO probieren


    /*const CommandLayout = ({visibleChange, ...props}) => {
        const cancelChanges = () => {
            //TODO quatsch glaube ich
            console.log("CANCEL CHANGES!");
            setAppointmentChanges({});
            visibleChange();
            if (isNewAppointment) {
                setEditingAppointment(previousAppointment);
                setIsNewAppointment(false);
            }
        }

        return <AppointmentForm.CommandLayout onCancelButtonClick={cancelChanges} {...props}/>
    }*/

    /*const AppointmentFormContainerBasic = (props) => {
        const [appointmentData, setAppointmentData] = useState(props.appointmentData);
        const [appointmentChanges, setAppointmentChanges] = useState({});

        const changeAppointment = ({field, changes}) => {
            const nextChanges = {...appointmentChanges, [field]: changes,};
            setAppointmentChanges(nextChanges);
        }

        const commitAppointment = (type) => {
            const appointment = {...appointmentData, ...appointmentChanges,};
            if (type === 'deleted') {
                commitChanges({ [type]: appointment.id });
            } else if (type === 'changed') {
                commitChanges({ [type]: { [appointment.id]: appointment } });
            } else {
                commitChanges({ [type]: appointment });
            }
            setAppointmentChanges({});
        }

        const displayAppointmentData = {...appointmentData, ...appointmentChanges,};

        const isNewAppointment = appointmentData.id === undefined;
        const applyChanges = isNewAppointment
            ? () => commitAppointment('added')
            : () => commitAppointment('changed');

        const textEditorProps = field => ({
            variant: 'outlined',
            onChange: ({ target: change }) => changeAppointment({
                field: [field], changes: change.value,
            }),
            value: displayAppointmentData[field] || '',
            label: field[0].toUpperCase() + field.slice(1),
            className: classes.textField,
        });

        const pickerEditorProps = field => ({
            // keyboard: true,
            value: displayAppointmentData[field],
            onChange: date => changeAppointment({
                field: [field], changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
            }),
            ampm: false,
            inputFormat: 'DD/MM/YYYY HH:mm',
            onError: () => null,
        });
        const startDatePickerProps = pickerEditorProps('startDate');
        const endDatePickerProps = pickerEditorProps('endDate');
        const cancelChanges = () => {
            setAppointmentChanges({});
            props.visibleChange();
            props.cancelAppointment();
        };

        return (
            <AppointmentForm.Overlay
                visible={props.visible}
                target={props.target}
                fullSize
                onHide={props.onHide}
            >
                <StyledDiv>
                    <div className={classes.header}>
                        <IconButton className={classes.closeButton} onClick={cancelChanges} size="large">
                            <Close color="action" />
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.wrapper}>
                            <Create className={classes.icon} color="action" />
                            <TextField
                                {...textEditorProps('title')}
                            />
                        </div>
                        <div className={classes.wrapper}>
                            <CalendarToday className={classes.icon} color="action" />
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                    label="Start Date"
                                    renderInput={
                                        props => <TextField className={classes.picker} {...props} />
                                    }
                                    {...startDatePickerProps}
                                />
                                <DateTimePicker
                                    label="End Date"
                                    renderInput={
                                        props => <TextField className={classes.picker} {...props} />
                                    }
                                    {...endDatePickerProps}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className={classes.wrapper}>
                            <LocationOn className={classes.icon} color="action" />
                            <TextField
                                {...textEditorProps('location')}
                            />
                        </div>
                        <div className={classes.wrapper}>
                            <Notes className={classes.icon} color="action" />
                            <TextField
                                {...textEditorProps('notes')}
                                multiline
                                rows="6"
                            />
                        </div>
                    </div>
                    <div className={classes.buttonGroup}>
                        {!isNewAppointment && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                onClick={() => {
                                    props.visibleChange();
                                    commitAppointment('deleted');
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                props.visibleChange();
                                applyChanges();
                            }}
                        >
                            {isNewAppointment ? 'Create' : 'Save'}
                        </Button>
                    </div>
                </StyledDiv>
            </AppointmentForm.Overlay>
        );
    }*/

    //TODO probieren
    /*const AppForm = connectProps(AppointmentFormContainerBasic, () => {

        const currentAppointment = schedulerData
                .filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0]
            || addedAppointment;
        const cancelAppointment = () => {
            if (isNewAppointment) {
                setEditingAppointment(previousAppointment);
                setIsNewAppointment(false);
            }
        };

        return {
            visible: editingFormVisible,
            appointmentData: currentAppointment,
            commitChanges: commitChanges,
            visibleChange: toggleEditingFormVisibility,
            onEditingAppointmentChange: onEditingAppointmentChange,
            cancelAppointment,
        };
    });*/
    /*const AppForm = connectProps(BasicLayout, () => {

        const currentAppointment = schedulerData
                .filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0]
            || addedAppointment;
        const cancelAppointment = () => {
            if (isNewAppointment) {
                setEditingAppointment(previousAppointment);
                setIsNewAppointment(false);
            }
        };

        return {
            visible: editingFormVisible,
            appointmentData: currentAppointment,
            commitChanges: commitChanges,
            visibleChange: toggleEditingFormVisibility,
            onEditingAppointmentChange: onEditingAppointmentChange,
            cancelAppointment,
        };
    });*/

    return(
        <div className="children-container">
            <div className="title">
                <h1><u>Übersicht Termine </u></h1>
            </div>
            <div className="appointment-container">
                {/*<div className="appointment-left">
                    <AppointmentInput isGlobalAppointment={true} callback={reloadData}/>
                </div>*/}
                <div className="appointment-right">
                    {/*!//TODO mal aufheben für später!*/}
                    {/*<ResourceSwitcher
                        resources={resources}
                        mainResourceName={mainResourceName}
                        onChange={onChangeMainResource}
                    />*/}
                    {/*{open && <AppointmentConfirmationDialog isOpen={open} />}*/}
                    {/*<ModalDialog>
                        //TODO das mal angucken!!!!
                    </ModalDialog>*/}
                    <div>
                        <ToastContainer position="bottom-center"/>
                    </div>
                    <Paper>
                        <Scheduler data={schedulerData} firstDayOfWeek={1} locale={"de-DE"}>
                            <ViewState currentDate={currentDate} onCurrentDateChange={onCurrentDateChange}/>
                            <EditingState
                                onCommitChanges={commitChanges}
                                /*onAddedAppointmentChange={onAddedAppointmentChange}
                                onEditingAppointmentChange={onEditingAppointmentChange}*/
                                //onAppointmentChangesChange={onChangeAppointmentChanges}
                                /*defaultAddedAppointment={defaultAddedAppointment()}*/
                                /*addedAppointment={addedAppointment}
                                editingAppointment={editingAppointment}
                                appointmentChanges={appointmentChanges}*/

                                /*editingAppointment={editingAppointment}
                                onEditingAppointmentChange={onEditingAppointmentChange}
                                addedAppointment={addedAppointment}
                                onAddedAppointmentChange={onAddedAppointmentChange}
                                appointmentChanges={appointmentChanges}
                                onAppointmentChangesChange={changeAppointment}*/
                                /*!//TODO dadurch hängt es
                                addedAppointment={addedAppointment}*/
                                /*onAddedAppointmentChange={setAddedAppointment}*/
                                /*addedAppointment={addedAppointment}
                                onAddedAppointmentChange={setAddedAppointment}
                                appointmentChanges={appointmentChanges}
                                onAppointmentChangesChange={setAppointmentChanges}
                                editingAppointment={editingAppointment}
                                onEditingAppointmentChange={setEditingAppointment}*/
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
                                /*appointmentData={currentAppointment()}*/
                                /*commandLayoutComponent={CommandLayout}*/
                                /*overlayComponent={AppForm}*/
                                /*commandButtonComponent={CommandButton}*/
                            />
                            <Resources
                                data={resources}
                                mainResourceName={mainResourceName}
                            />
                        </Scheduler>

                        {/*!//TODO ja hier so ähnlich!!!*/}
                        <Dialog
                            open={confirmationVisible}
                        >
                            <DialogTitle>
                                Add Appointment
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to add this appointment?
                                    <FormLabel>
                                        {JSON.stringify(addedAppointment)}
                                    </FormLabel>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={toggleConfirmationVisible} color="primary" variant="outlined">
                                    Cancel
                                </Button>
                                <Button onClick={commitAddedAppointment} color="secondary" variant="outlined">
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <StyledFab
                            color="secondary"
                            className={classes.addButton}
                            onClick={() => {
                                setEditingFormVisible(true);
                                printSettings();
                                let newAppointment = {
                                    startDate: new Date(new Date(Date.now()).setHours(9,0)),
                                    endDate: new Date(new Date(Date.now()).setHours(10,0)),
                                }
                                onEditingAppointmentChange(undefined);
                                onAddedAppointmentChange(newAppointment);
                                /*console.log("SET APPOINTMENT TO ADDED", JSON.stringify(newAppointment));
                                await setAddedAppointment(newAppointment);*/
                            }}
                        >
                            <AddIcon />
                        </StyledFab>
                    </Paper>
                </div>
            </div>
        </div>
    );
}