import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Persons from "../services/person.service";

export default function AsdInput({title, callback}) {

    const [asds, setAsds] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [youthoffice, setYouthoffice] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        Persons.getAllAsds().then(response => {
            if (response.data) {
                let asds = [{ id: 0, name: "keine"}];
                response.data.map(asd => {
                    asds.push(asd);
                })
                setAsds(asds);
            }
        });
    }, [])

    const onExistingChange = (e) => {
        let id = e.target.value;

        Persons.getAsdById(id).then(response => {
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                setYouthoffice(response.data.youthoffice);
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id,response.data.name,response.data.youthoffice,response.data.phone,response.data.fax,response.data.email);
            } else {
                setId("0");
                setName("");
                setYouthoffice("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        });
    }

    const onNameChange = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,youthoffice,phone,fax,email);
    }

    const onYouthofficeChange = (e) => {
        setYouthoffice(e.target.value);
        sendInputToParent(id,name,e.target.value,phone,fax,email);
    }

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,youthoffice,e.target.value,fax,email);
    }

    const onFaxChange = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,youthoffice,phone,e.target.value,email);
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        sendInputToParent(id,name,youthoffice,phone,fax,e.target.value);
    }

    const sendInputToParent = (id,name,youthoffice,phone,fax,email) => {
        let asd = {};
        asd.id = id;
        asd.name = name;
        asd.youthoffice = youthoffice;
        asd.phone = phone;
        asd.fax = fax;
        asd.email = email;
        callback(asd);
    }

    const sendEmptyInputToParent = () => {
        let asd = {};
        callback(asd);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-row">
                        <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                        <select onChange={onExistingChange} className="input-select" id="existing" name="existing">
                            {asds.map((guard) => (
                                <option key={guard.id} value={guard.id}>{guard.name}</option>
                            ))}
                        </select>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onNameChange} className="input-input" value={name} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label"><b>Jugendamt*</b></label>
                        <input onChange={onYouthofficeChange} className="input-input" value={youthoffice} name="youthoffice" id="youthoffice" type="text" placeholder="Jugendamt"/>
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