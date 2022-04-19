import React, { useEffect, useState } from "react";
import '../style/table.input.component.css';
import '../style/input.component.css';

export default function CreatePartner({callback}) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    const onChangeType = (e) => {
        setType(e.target.value);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const clearInput = () => {
        setType("");
        setName("");
        setStreet("");
        setNumber("");
        setZipcode("");
        setCity("");
        setPhone("");
        setFax("");
        setEmail("");
    }

    const validate = () => {
        setErrors([]);

        if (type === "") {
            errors.push("Typ darf nicht leer sein!");
        }

        if (name === "") {
            errors.push("Name darf nicht leer sein!");
        }

        if (phone === "") {
            errors.push("Telefon darf nicht leer sein!");
        }

        if (errors.length !== 0) {
            setMessageInvalid(JSON.stringify(errors));
            setMessage("");
            return false;
        } else {
            setMessageInvalid("");
            return true;
        }
    }

    const onCreate = () => {
        if (validate()) {
            let address = {};
            address.street = street;
            address.number = number;
            address.zipCode = zipcode;
            address.city = city;

            setMessage("Netzwerkpartner hinzugefügt");
            setMessageInvalid("");
            clearInput();
            sendInputToParent(type,name,address,phone,fax,email);
        }
    }

    const sendInputToParent = (type,name,address,phone,fax,email) => {
        let partner = {};
        partner.type = type;
        partner.name = name;
        partner.address = address;
        partner.phone = phone;
        partner.fax = fax;
        partner.email = email;
        callback(partner);
    }

    return(
        <div>
            <div className="table-input-create-panel">

                <div className="table-input-create-column-left">

                    <span className="input-row">
                        <label className="input-label" htmlFor="type"><b>Typ*</b></label>
                        <input value={type} onChange={onChangeType} className="input-input" name="type" id="type" type="text" placeholder="Typ"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input value={name} onChange={onChangeName} className="input-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label"><b>Adresse</b></label>
                        <div className="input-address-row">
                            <input value={street} onChange={onChangeStreet} className="table-input-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input value={number} onChange={onChangeNumber} className="table-input-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                            <input value={zipcode} onChange={onChangeZipcode} className="table-input-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input value={city} onChange={onChangeCity} className="table-input-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                </div>

                <div className="table-input-create-column-right">

                    <span className="input-row">
                        <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                        <input value={phone} onChange={onChangePhone} className="input-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="fax"><b>Fax</b></label>
                        <input value={fax} onChange={onChangeFax} className="input-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input value={email} onChange={onChangeEmail} className="input-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

            <div className="table-input-submit-row">
                <button type="button" className="table-input-submit" onClick={onCreate}>Hinzufügen</button>
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