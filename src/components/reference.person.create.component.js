import React, { useEffect, useState } from "react";
import '../style/table.input.component.css';
import '../style/input.component.css';
import {isJsonEmpty} from "../utils/utils";

export default function CreateReferencePerson({editperson,callback}) {
    const [type, setType] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    const [buttonTitle, setButtonTitle] = useState("Hinzufügen")

    useEffect(() => {
        if (editperson !== undefined && !isJsonEmpty(editperson)) {
            console.log("Edit_Person: " + JSON.stringify(editperson));
            setType(editperson.type);
            let names = editperson.name.split(/(\s+)/);
            setFirstname(names[0]);
            setLastname(names[2]);
            setBirthday(editperson.birthday);
            setStreet(editperson.address.street);
            setNumber(editperson.address.number);
            setZipcode(editperson.address.zipCode);
            setCity(editperson.address.city);
            setPhone(editperson.phone);
            setEmail(editperson.email);
            setButtonTitle("Ändern");
        }
    }, [editperson])

    const onChangeType = (e) => {
        setType(e.target.value);
    }

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
    }

    const onChangeLastname = (e) => {
        setLastname(e.target.value);
    }

    const onChangeBirthday = (e) => {
        setBirthday(e.target.value);
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

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const clearInput = () => {
        setType("");
        setFirstname("");
        setLastname("");
        setBirthday("");
        setStreet("");
        setNumber("");
        setZipcode("");
        setCity("");
        setPhone("");
        setEmail("");
    }

    const validate = () => {
        setErrors([]);

        if (type === "") {
            errors.push("Typ darf nicht leer sein!");
        }

        if (firstname === "") {
            errors.push("Vorname darf nicht leer sein!");
        }

        if (lastname === "") {
            errors.push("Nachname darf nicht leer sein!");
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
            let name = firstname + ' ' + lastname;
            let address = {};
            address.street = street;
            address.number = number;
            address.zipCode = zipcode;
            address.city = city;

            setMessage("Bezugsperson hinzugefügt");
            setMessageInvalid("");
            clearInput();
            sendInputToParent(type,name,birthday,address,phone,email);
        }
    }

    const sendInputToParent = (type,name,birthday,address,phone,email) => {
        let person = {};
        person.type = type;
        person.name = name;
        person.birthday = birthday;
        person.address = address;
        person.phone = phone;
        person.email = email;
        setButtonTitle("Hinzufügen");
        callback(person);
    }

    return(
        <div>
            <div className="table-input-create-panel">

                <div className="table-input-create-column-left">

                    <span className="input-row">
                        <label className="input-label" htmlFor="firstname"><b>Typ*</b></label>
                        <input value={type} onChange={onChangeType} className="input-input" name="type" id="type" type="text" placeholder="Typ"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                        <input value={firstname} onChange={onChangeFirstname} className="input-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="lastname"><b>Nachname*</b></label>
                        <input value={lastname} onChange={onChangeLastname} className="input-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="birthday"><b>Geburtstag</b></label>
                        <input value={birthday} onChange={onChangeBirthday} className="input-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                    </span>

                </div>

                <div className="table-input-create-column-right">

                    <span className="input-row">
                        <label className="input-label"><b>Adresse</b></label>
                        <div className="input-address-row">
                            <input value={street} onChange={onChangeStreet} className="table-input-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input value={number} onChange={onChangeNumber} className="table-input-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                            <input value={zipcode} onChange={onChangeZipcode} className="table-input-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input value={city} onChange={onChangeCity} className="table-input-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                        <input value={phone} onChange={onChangePhone} className="input-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input value={email} onChange={onChangeEmail} className="input-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

            <div className="table-input-submit-row">
                <button type="button" className="table-input-submit" onClick={onCreate}>{buttonTitle}</button>
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