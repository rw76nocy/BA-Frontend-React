import React, {useEffect, useState} from "react";

import ListView from "./list.view.component";

import '../style/input.component.css';
import '../style/table.input.component.css';
import AuthService from "../services/auth.service";
import Accounts from "../services/accounts.service";
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";
import ChildrenService from "../services/children.service";
import AppointmentService from "../services/appointment.service";

export default function AppointmentInput({isGlobalAppointment, callback}) {

    const [title, setTitle] = useState("");
    const [startdate, setStartdate] = useState("");
    const [starttime, setStarttime] = useState("");
    const [enddate, setEnddate] = useState("");
    const [endtime, setEndtime] = useState("");
    const [location, setLocation] = useState("");
    const [typeId, setTypeId] = useState("");
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [color, setColor] = useState("");
    const [hasInterval, setHasInterval] = useState(false);
    const [intervall, setInterval] = useState("täglich");
    const [intervalEnd, setIntervalEnd] = useState("");
    const [livingGroup, setLivingGroup] = useState({});
    const [employees, setEmployees] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        reloadData();
    }, [])

    const getAppointmentColor = (id) => {
        let col = "";
        appointmentTypes.map(app => {
            if (String(app.id) === id) {
                col = app.color;
            }
        });
        return col;
    }

    const getAppointmentType = (id) => {
        let type = {};
        appointmentTypes.map(app => {
            if (String(app.id) === id) {
                type = app;
            }
        });
        return type;
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const onChangeStartdate = (e) => {
        setStartdate(e.target.value);
    }

    const onChangeStarttime = (e) => {
        setStarttime(e.target.value);
    }

    const onChangeEnddate = (e) => {
        setEnddate(e.target.value);
    }

    const onChangeEndtime = (e) => {
        setEndtime(e.target.value);
    }

    const onChangeLocation = (e) => {
        setLocation(e.target.value);
    }

    const onChangeColor = (e) => {
        setColor(e.target.value);
    }

    const onChangeType = (e) => {
        setTypeId(e.target.value);
        setColor(getAppointmentColor(e.target.value));
    }

    const onChangeHasInterval = () => {
        setHasInterval(!hasInterval);
    }

    const onChangeInterval = (e) => {
        setInterval(e.target.value);
    }

    const onChangeIntervalEnd = (e) => {
        setIntervalEnd(e.target.value);
    }

    const onChangeEmployees = (input) => {
        setSelectedEmployees(input);
    }

    const onChangeChildren = (input) => {
        setSelectedChildren(input);
    }

    const clearInput = () => {
        setTitle("");
        setStartdate("");
        setStarttime("");
        setEnddate("");
        setEndtime("");
        setLocation("");
        setTypeId(appointmentTypes[0].id);
        setColor(appointmentTypes[0].color);
        setHasInterval(false);
        setInterval("täglich");
        setIntervalEnd("");
        reloadData();
    }

    const reloadData = () => {
        let id = AuthService.getCurrentUser().id;
        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    setLivingGroup(response.data[0]);
                    Employees.getAllEmployeesByLivingGroup(response.data[0].name).then(response => {
                        setEmployees(response.data);
                    });
                    ChildrenService.getChildrenByLivingGroup(response.data[0].name).then(response => {
                        setChildren(response.data);
                    });
                    AppointmentService.getAppointmentTypesByLivingGroup(response.data[0].name).then(response => {
                        setAppointmentTypes(response.data);
                        if (response.data[0]) {
                            setTypeId(response.data[0].id);
                            setColor(response.data[0].color);
                        }
                    })
                }
            });
        });
    }

    const validate = () => {
        setErrors([]);

        if (title === "") {
            errors.push("Titel muss angegeben werden!");
        }

        if (startdate === "") {
            errors.push("Startdatum muss angegeben werden!");
        }

        if (starttime === "") {
            errors.push("Startzeit muss angegeben werden!");
        }

        if (enddate === "") {
            errors.push("Enddatum muss angegeben werden!");
        }

        if (endtime === "") {
            errors.push("Endzeit muss angegeben werden!");
        }

        if (location === "") {
            errors.push("Ort muss angegeben werden!");
        }

        if (typeId === "") {
            errors.push("Terminart muss angegeben werden!");
        }

        if (hasInterval) {
            if (intervalEnd === "") {
                errors.push("Bei Wiederholung muss ein Enddatum angegeben werden!")
            }
        }

        if (selectedEmployees.length === 0) {
            errors.push("Mindestens ein Teilnehmer muss ausgewählt sein!");
        }

        if (errors.length !== 0) {
            setMessageInvalid(JSON.stringify(errors));
            setMessage("");
            console.log("INPUT UNGÜLTIG!!!");
            return false;
        } else {
            setMessageInvalid("");
            console.log("INPUT GÜLTIG!!!");
            return true;
        }
    }

    const buildAppointmentFromInput = () => {
        let appointment = {};
        appointment.title = title;
        appointment.startDate = startdate;
        appointment.startTime = starttime;
        appointment.endDate = enddate;
        appointment.endTime = endtime;
        appointment.location = location;
        appointment.appointmentType = getAppointmentType(typeId);
        appointment.hasInterval = hasInterval;
        appointment.interval = intervall;
        appointment.intervalEnd = intervalEnd;
        appointment.livingGroup = livingGroup;
        appointment.employees = selectedEmployees;
        appointment.children = selectedChildren;
        return appointment;
    }

    const createAppointment = () => {
        if (validate()) {
            let appointment = buildAppointmentFromInput();

            AppointmentService.addAppointment(appointment).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                    clearInput();
                    callback();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessageInvalid(resMessage);
                }
            );
        }
    }

    return (
        <div className="input-container">
            <div className="input-create-container">

                <div className="table-input-title">
                    <h2><u>Neuer Termin</u></h2>
                </div>

                <span className="input-row">
                    <label className="input-label" htmlFor="text"><b>Titel*</b></label>
                    <textarea onChange={onChangeTitle} className="textarea-input" value={title} name="text" id="text" wrap="soft"/>
                </span>

                <span className="input-sub-row">
                    <div className="input-half-row-first">
                        <label className="input-label" htmlFor="startdate"><b>Startdatum*</b></label>
                        <input onChange={onChangeStartdate} className="input-input" value={startdate} name="startdate" id="startdate" type="date" placeholder="TT.MM.JJJJ"/>
                    </div>
                    <div className="input-half-row-second">
                        <label className="input-label" htmlFor="starttime"><b>Startzeit*</b></label>
                        <input onChange={onChangeStarttime} className="input-input" value={starttime} name="starttime" id="starttime" type="time" placeholder="HH:MM"/>
                    </div>
                </span>

                <span className="input-sub-row">
                    <div className="input-half-row-first">
                        <label className="input-label" htmlFor="enddate"><b>Enddatum*</b></label>
                        <input onChange={onChangeEnddate} className="input-input" value={enddate} name="enddate" id="enddate" type="date" placeholder="TT.MM.JJJJ"/>
                    </div>
                    <div className="input-half-row-second">
                        <label className="input-label" htmlFor="endtime"><b>Endzeit*</b></label>
                        <input onChange={onChangeEndtime} className="input-input" value={endtime} name="endtime" id="endtime" type="time" placeholder="HH:MM"/>
                    </div>
                </span>

                <span className="input-row">
                    <label className="input-label" htmlFor="location"><b>Ort</b></label>
                    <input onChange={onChangeLocation} className="input-input" value={location} name="location" id="location" type="text" placeholder="Ort"/>
                </span>

                <span className="input-sub-row">
                    <div className="input-half-row-first">
                        <label className="input-label" htmlFor="type"><b>Terminart</b></label>
                        <select onChange={onChangeType} className="input-select" value={typeId} name="type" id="type">
                            {appointmentTypes.map((app) => (
                                <option key={app.id} value={app.id}>{app.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-half-row-second">
                        <label className="input-label" htmlFor="color"><b>Farbe</b></label>
                        <input onChange={onChangeColor} className="input-input" disabled={true} name="color" id="color" type="color" value={color} />
                    </div>
                </span>

                <span className="input-sub-row">
                    <label className="input-label" htmlFor="intervall"><b>Wiederholung</b></label>
                    <div className="interval-row-first">
                        <input onChange={onChangeHasInterval} defaultChecked={hasInterval} className="input-input" name="check" id="check" type="checkbox"/>
                    </div>
                    <div className="interval-row-second">
                        <select onChange={onChangeInterval} className="input-select" disabled={!hasInterval} value={intervall} name="intervall" id="intervall">
                            <option value="täglich">täglich</option>
                            <option value="wöchentlich">wöchentlich</option>
                            <option value="2-Wochen-Takt">2-Wochen-Takt</option>
                            <option value="monatlich">monatlich</option>
                        </select>
                    </div>
                    <div className="interval-row-third">
                        <b>bis</b>
                    </div>
                    <div className="interval-row-forth">
                        <input onChange={onChangeIntervalEnd} className="input-input" disabled={!hasInterval} value={intervalEnd} name="finish" id="finish" type="date" placeholder="TT.MM.JJJJ"/>
                    </div>
                </span>

                <ListView title="Teilnehmer*" data={employees} callback={onChangeEmployees} />
                {isGlobalAppointment && <ListView title="Kinder" data={children} callback={onChangeChildren} />}


                <span className="input-row">
                    <div className="table-input-toggle-row">
                        <button onClick={createAppointment} className="table-input-toggle-button" type="button">Anlegen</button>
                    </div>
                </span>

                <div>
                    <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
                </div>
                <div>
                    <span style={{color: "green", width: "100%"}}>{message}</span>
                </div>

            </div>
        </div>
    );
}