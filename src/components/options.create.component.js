import React, { useEffect, useState } from "react";
import '../style/table.input.component.css';
import '../style/input.component.css';
import AppointmentService from "../services/appointment.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import AuthService from "../services/auth.service";
import {formatErrorMessage, handleError} from "../utils/utils";
import {toast, ToastContainer} from "react-toastify";

export default function CreateOptions({reloadTable}) {
    const [livingGroup, setLivingGroup] = useState({});
    const [name, setName] = useState("");
    const [color, setColor] = useState("#09afff");

    const [errors, setErrors] = useState([]);

    useEffect(async () => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            try {
                const account = await Accounts.getAccountById(id);
                const lg = (await LivingGroups.getLivingGroup(account.data.person.livingGroup.name)).data;
                setLivingGroup(lg[0]);
            } catch (error) {
                handleError(error);
            }
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
            toast.error(formatErrorMessage(errors));
            return false;
        } else {
            return true;
        }
    }

    const onCreate = async () => {
        if (validate()) {
            let appointmentType = {};
            appointmentType.name = name;
            appointmentType.color = color;
            appointmentType.livingGroup = livingGroup.name;

            try {
                const response = await AppointmentService.addAppointmentType(appointmentType);
                toast.success(response.data.message);
                clearInput();
                await reloadTable();
            } catch (error) {
                handleError(error);
            }
        }
    }

    return(
        <div>
            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
            </div>

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

        </div>
    );
}