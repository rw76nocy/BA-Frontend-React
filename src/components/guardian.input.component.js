import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Persons from "../services/person.service";
import {findPersonByType, handleError, isJsonEmpty} from "../utils/utils";
import {ToastContainer} from "react-toastify";

export default function GuardianInput({title, callback, data, disabled}) {

    const [guardians, setGuardians] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            let guard = findPersonByType(data.personRoles, "GUARDIAN");
            if (!isJsonEmpty(guard)) {
                setId(guard.id);
                setName(guard.name);
                setPhone(guard.phone);
                setFax(guard.fax);
                setEmail(guard.email);
                sendInputToParent(guard.id,guard.name,guard.phone,guard.fax,guard.email);
            } else {
                setId("0");
                setName("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        }
    }, [data, disabled])

    useEffect(async () => {
        try {
            const response = await Persons.getAllGuardians();
            if (response.data) {
                let guards = [{ id: 0, name: "keine"}];
                response.data.map(guard => {
                    guards.push(guard);
                })
                setGuardians(guards);
            }
        } catch (error) {
            handleError(error);
        }
    }, [])

    const onExistingChange = async (e) => {
        let id = e.target.value;

        try {
            const response = await Persons.getPersonById(id);
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id,response.data.name,response.data.phone,response.data.fax,response.data.email);
            } else {
                setId("0");
                setName("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        } catch (error) {
            handleError(error);
        }
    }

    const onNameChange = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,phone,fax,email);
    }

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,e.target.value,fax,email);
    }

    const onFaxChange = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,phone,e.target.value,email);
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        sendInputToParent(id,name,phone,fax,e.target.value);
    }

    const sendInputToParent = (id,name,phone,fax,email) => {
        let guard = {};
        guard.id = id;
        guard.name = name;
        guard.phone = phone;
        guard.fax = fax;
        guard.email = email;
        callback(guard);
    }

    const sendEmptyInputToParent = () => {
        let guard = {};
        callback(guard);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    {!disabled &&
                        <span className="input-row">
                            <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                            <select onChange={onExistingChange} className="input-select" value={id} aria-readonly={disabled} id="existing" name="existing">
                                {guardians.map((guard) => (
                                    <option key={guard.id} value={guard.id}>{guard.name}</option>
                                ))}
                            </select>
                        </span>
                    }

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onNameChange} className="input-input" value={name} readOnly={disabled} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onPhoneChange} className="input-input" value={phone} readOnly={disabled} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onFaxChange} className="input-input" value={fax} readOnly={disabled} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onEmailChange} className="input-input" value={email} readOnly={disabled} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

        </div>
    );
}