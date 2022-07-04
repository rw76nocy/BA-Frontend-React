import React, {useEffect, useMemo, useState} from "react";
import '../style/table.input.component.css';
import '../style/appointment.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

import AppointmentInput from "./appointment.input";
import Paper from '@mui/material/Paper';
import {
    AppointmentForm,
    EditingState,
    IntegratedEditing,
    ViewState
} from '@devexpress/dx-react-scheduler';
import {Scheduler, WeekView, Toolbar, DateNavigator, Appointments, TodayButton, ViewSwitcher, MonthView, DayView, AppointmentTooltip, Resources, ConfirmationDialog} from '@devexpress/dx-react-scheduler-material-ui';
import LivingGroups from "../services/living.group.service";
import AppointmentService from "../services/appointment.service";
import {Grid, IconButton, MenuItem, Select, styled} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

export default function Appointment() {

    const [currentDate, setCurrentDate] = useState(Date.now);
    const [schedulerData, setSchedulerData] = useState([]);
    const [appointmentMeta, setAppointmentMeta] = useState({target : null, data : {}})
    const [visible, setVisible] = useState(false);
    const [resources, setResources] = useState([]);
    const [mainResourceName, setMainResourceName] = useState("type");

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        reloadData();
    }, [])

    const reloadData = () => {
        let id = AuthService.getCurrentUser().id;
        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    AppointmentService.getAppointmentsByLivingGroup(response.data[0].name).then(response => {
                        setSchedulerData(formatAppointments(response.data));
                    });
                }
            });
        });
    }

    const createLocationResource = (appointments) => {
        let obj = {};
        obj.fieldName = "location";
        obj.title = "Ort";

        let instances = [];
        appointments.map(a => {
            let ins = {};
            ins.id = a.location;
            ins.text = a.location;
            ins.color = "#ffffff";
            instances.push(ins);
        });
        obj.instances = instances;

        return obj;
    }

    const createTypeResource = (appointments) => {
        let obj = {};
        obj.fieldName = "type";
        obj.title = "Terminart";

        let instances = [];
        appointments.map(a => {
            let ins = {};
            ins.id = a.appointmentType.name;
            ins.text = a.appointmentType.name;
            ins.color = a.appointmentType.color;
            instances.push(ins);
        });
        obj.instances = instances;

        return obj;
    }

    const createMemberResource = (appointments) => {
        //TODO müssen hier evtl alle Mitarbeiter rein? Fürs Editieren dann später?
        let obj = {};
        obj.fieldName = "members";
        obj.title = "Teilnehmer";
        obj.allowMultiple = true;

        let instances = [];
        appointments.map(a => {
            a.appointmentPersonParticipants.map(app => {
                let ins = {};
                ins.id = app.person.name;
                ins.text = app.person.name;
                ins.color = "#d1bc8a";

                let isDuplicate = false;
                instances.map(i => {
                    if (i.text === ins.text) {
                        isDuplicate = true;
                    }

                });
                if (!isDuplicate) {
                    instances.push(ins);
                }
            })
        });
        obj.instances = instances;

        return obj;
    }

    const createChildrenResource = (appointments) => {
        //TODO müssen hier evtl alle Kinder rein? Fürs Editieren dann später?
        let obj = {};
        obj.fieldName = "children";
        obj.title = "Kinder";
        obj.allowMultiple = true;

        let instances = [];
        appointments.map(a => {
            a.appointmentChildParticipants.map(app => {
                let ins = {};
                ins.id = app.child.fullName;
                ins.text = app.child.fullName;
                ins.color = "#000000";

                let isDuplicate = false;
                instances.map(i => {
                    if (i.text === ins.text) {
                        isDuplicate = true;
                    }

                });
                if (!isDuplicate) {
                    instances.push(ins);

                }
            })
        });
        obj.instances = instances;

        return obj;
    }

    const createResources = (appointments) => {
        let arr = [];
        arr.push(createLocationResource(appointments));
        arr.push(createTypeResource(appointments));
        arr.push(createMemberResource(appointments));
        arr.push(createChildrenResource(appointments));
        return arr;
    }

    const formatAppointments = (data) => {
        //TODO das kann jetzt evtl einfacher formuliert werden
        let res = createResources(data);
        setResources(res);

        let copy = [...data];
        copy.map(a => {
            a.type = a.appointmentType.name;
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

    //TODO mal aufheben für später!
    /*const onChangeMainResource = (e) => {
        console.log("Change Resource Name: "+e);
        setMainResourceName(e);
    }*/

    const onCurrentDateChange = (currentDate) => {
        setCurrentDate(currentDate);
    }

    const commitChanges = ({ changed, deleted }) => {
        let data = [...schedulerData];
        console.log("DATA: "+JSON.stringify(data));
        console.log("DELETED: "+deleted);
        if (deleted !== undefined) {
            data = data.filter(appointment => appointment.id !== deleted);
            AppointmentService.deleteAppointment(deleted).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage("");
                    setMessageInvalid(resMessage);
                });
        }
        setSchedulerData(data);
        /*this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });*/
    }

    const todayText = {
        today: 'Heute'
    };

    const confirmationMessages = {
        cancelButton: 'Abbrechen',
        deleteButton: 'Entfernen',
        confirmDeleteMessage: 'Bist du dir sicher, dass du diesen Termin entfernen willst?'
    };

    return(
        <div className="children-container">
            <div className="title">
                <h1><u>Übersicht Termine </u></h1>
            </div>
            <div className="appointment-container">
                <div className="appointment-left">
                    <AppointmentInput isGlobalAppointment={true} callback={reloadData}/>
                </div>
                <div className="appointment-right">
                    {/*//TODO mal aufheben für später!*/}
                    {/*<ResourceSwitcher
                        resources={resources}
                        mainResourceName={mainResourceName}
                        onChange={onChangeMainResource}
                    />*/}
                    <div>
                        <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
                    </div>
                    <div>
                        <span style={{color: "green", width: "100%"}}>{message}</span>
                    </div>
                    <Paper>
                        <Scheduler data={schedulerData} firstDayOfWeek={1} locale={"de-DE"}>
                            <ViewState currentDate={currentDate} onCurrentDateChange={onCurrentDateChange}/>
                            <EditingState onCommitChanges={commitChanges}/>
                            <IntegratedEditing />
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