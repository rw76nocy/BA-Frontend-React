import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Persons from "../services/person.service";

export default function ChildDoctorInput({title, callback}) {

    const [childdoctors, setChilddoctors] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        Persons.getAllChilddoctors().then(response => {
            if (response.data) {
                let docs = [{ id: 0, name: "keine"}];
                response.data.map(doc => {
                    docs.push(doc);
                })
                setChilddoctors(docs);
            }
        });
    }, [])

    const onExistingDocChange = (e) => {
        let id = e.target.value;

        Persons.getPersonById(id).then(response => {
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
        });
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
        let doc = {};
        doc.id = id;
        doc.name = name;
        doc.phone = phone;
        doc.fax = fax;
        doc.email = email;
        callback(doc);
    }

    const sendEmptyInputToParent = () => {
        let doc = {};
        callback(doc);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-row">
                        <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                        <select onChange={onExistingDocChange} className="input-select" id="existing" name="existing">
                            {childdoctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                        </select>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onNameChange} className="input-input" value={name} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onPhoneChange} className="input-input" value={phone} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onFaxChange} className="input-input" value={fax} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onEmailChange} className="input-input" value={email} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

        </div>
    );
}