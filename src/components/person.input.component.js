import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import {findPersonByType, isJsonEmpty} from "../utils/utils";

export default function PersonInput({title, callback, data, disabled}) {

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState({});
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [birthday, setBirthday] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            let person = {};
            if (title === "Mutter") {
                person = findPersonByType(data.personRoles, "MOTHER");
            }
            if (title === "Vater") {
                person = findPersonByType(data.personRoles, "FATHER");
            }
            if (!isJsonEmpty(person)) {
                let names = person.name.split(/(\s+)/);
                setFirstname(names[0]);
                setLastname(names[2]);
                setAddress(person.address);
                setStreet(person.address.street);
                setNumber(person.address.number);
                setZipcode(person.address.zipCode);
                setCity(person.address.city);
                setPhone(person.phone);
                setFax(person.fax);
                setBirthday(person.birthday);
                setEmail(person.email);
                sendInputToParent(names[0],names[2],buildAddress(person.address.street,person.address.number,person.address.zipCode,person.address.city),person.phone,person.fax,person.birthday,person.email);
            } else {
                setFirstname("");
                setLastname("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
                setBirthday("");
                setEmail("");
                sendEmptyInputToParent();
            }
        }
    }, [data, disabled])

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
        sendInputToParent(e.target.value,lastname,address,phone,fax,birthday,email);
    }

    const onChangeLastname = (e) => {
        setLastname(e.target.value);
        sendInputToParent(firstname,e.target.value,address,phone,fax,birthday,email);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
        setAddress(buildAddress(e.target.value,number,zipcode,city));
        sendInputToParent(firstname,lastname,buildAddress(e.target.value,number,zipcode,city),phone,fax,birthday,email);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
        setAddress(buildAddress(street,e.target.value,zipcode,city));
        sendInputToParent(firstname,lastname,buildAddress(street,e.target.value,zipcode,city),phone,fax,birthday,email);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
        setAddress(buildAddress(street,number,e.target.value,city));
        sendInputToParent(firstname,lastname,buildAddress(street,number,e.target.value,city),phone,fax,birthday,email);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
        setAddress(buildAddress(street,number,zipcode,e.target.value));
        sendInputToParent(firstname,lastname,buildAddress(street,number,zipcode,e.target.value),phone,fax,birthday,email);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
        sendInputToParent(firstname,lastname,address,e.target.value,fax,birthday,email);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
        sendInputToParent(firstname,lastname,address,phone,e.target.value,birthday,email);
    }

    const onChangeBirthday = (e) => {
        setBirthday(e.target.value);
        sendInputToParent(firstname,lastname,address,phone,fax,e.target.value,email);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
        sendInputToParent(firstname,lastname,address,phone,fax,birthday,e.target.value);
    }

    const buildAddress = (street,number,zipcode,city) => {
        let address = {};
        address.street = street;
        address.number = number;
        address.zipCode = zipcode;
        address.city = city;
        return address;
    }

    const sendInputToParent = (firstname,lastname,address,phone,fax,birthday,email) => {
        let person = {};
        person.firstname = firstname;
        person.lastname = lastname;
        person.address = address;
        person.phone = phone;
        person.fax = fax;
        person.birthday = birthday;
        person.email = email;
        callback(person);
    }

    const sendEmptyInputToParent = () => {
        let person = {};
        callback(person);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input onChange={onChangeFirstname} className="input-input" value={firstname} readOnly={disabled} name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="firstname"><b>Nachname*</b></label>
                            <input onChange={onChangeLastname} className="input-input" value={lastname} readOnly={disabled} name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label"><b>Adresse*</b></label>
                        <div className="input-address-row">
                            <input onChange={onChangeStreet} className="input-address-street" value={street} readOnly={disabled} name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input onChange={onChangeNumber} className="input-address-number" value={number} readOnly={disabled} name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="input-address-row">
                            <input onChange={onChangeZipcode} className="input-address-zipcode" value={zipcode} readOnly={disabled} name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input onChange={onChangeCity} className="input-address-city" value={city} readOnly={disabled} name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onChangePhone} className="input-input" value={phone} readOnly={disabled} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onChangeFax} className="input-input" value={fax} readOnly={disabled} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="birthday"><b>Geburtsdatum</b></label>
                            <input onChange={onChangeBirthday} className="input-input" value={birthday} readOnly={disabled} name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                            <input onChange={onChangeEmail} className="input-input" value={email} readOnly={disabled} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                        </div>
                    </span>

                </div>

            </div>

        </div>
    );
}