import React, { useEffect, useState } from "react";
import '../style/table.input.component.css';
import '../style/input.component.css';
import EmployeesService from '../services/employees.service';
import AppointmentService from "../services/appointment.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import AuthService from "../services/auth.service";

export default function CreateOptions({reloadTable}) {
    const [livingGroup, setLivingGroup] = useState({});
    const [name, setName] = useState("");
    const [color, setColor] = useState("#09afff");

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                    if (response.data[0]) {
                        setLivingGroup(response.data[0]);
                    }
                });
            });
        }
    },[])

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeColor = (e) => {
        setColor(e.target.value);
    }

    const clearInput = () => {
        setName("");
        setColor("#09afff");
    }

    const validate = () => {
        setErrors([]);

        if (name === "") {
            errors.push("Name darf nicht leer sein!");
        }

        if (errors.length !== 0) {
            setMessageInvalid(JSON.stringify(errors));
            return false;
        } else {
            setMessageInvalid("");
            return true;
        }
    }

    const onCreate = () => {
        if (validate()) {
            console.log("Alle Eingaben sind gültig!");

            let appointmentType = {};
            appointmentType.name = name;
            appointmentType.color = color;
            appointmentType.livingGroup = livingGroup.name;

            console.log(JSON.stringify(appointmentType));

            AppointmentService.addAppointmentType(appointmentType).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                    clearInput();
                    reloadTable();
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

    return(
        <div>
            <div className="table-input-create-panel">

                <div className="table-input-create-column-left">

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input value={name} onChange={onChangeName} className="input-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                </div>

                <div className="table-input-create-column-right">

                    <span className="input-row">
                        <label className="input-label" htmlFor="color"><b>Farbe</b></label>
                        <input value={color} onChange={onChangeColor} style={{width: "10%"}} className="input-input" name="color" id="color" type="color"/>
                    </span>

                </div>

            </div>

            <div>
                <button type="button" className="table-input-submit" onClick={onCreate}>Anlegen</button>
            </div>

            <div>
                <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
            </div>
            <div>
                <span style={{color: "green", width: "100%"}}>{message}</span>
            </div>

        </div>
    );
}