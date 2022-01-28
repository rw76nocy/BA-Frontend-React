import React, { useEffect, useState, useMemo } from "react";
import '../style/employees.component.css';
import EmployeesService from '../services/employees.service';
import LivingGroups from "../services/living.group.service";

export default function CreateEmployees() {
    const [gender, setGender] = useState("MALE");
    const [livingGroup, setLivingGroup] = useState("");
    const [livingGroups, setLivingGroups] = useState([]);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        LivingGroups.getLivingGroups().then(response => {
            setLivingGroups(response.data);
            if (response.data[0]) {
                setLivingGroup(response.data[0].name);
            }
        });
    },[])

    const onChangeGender = (e) => {
        setGender(e.target.value);
    }

    const onChangeLivingGroup = (e) => {
        setLivingGroup(e.target.value);
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

    const onCreate = () => {
        console.log(gender);
        console.log(livingGroup);
        console.log(firstname);
        console.log(lastname);
        console.log(birthday);
        console.log(street + ' ' + number + ', ' + zipcode + ' ' + city);
        console.log(phone);
        console.log(email);
        //TODO hier dann employees add service
    }

    return(
        <div>
            <div className="employees-create-panel">

                <div className="employees-create-column-left">

                    <span className="employees-gender-lg-row">
                        <div className="employees-gender-row">
                            <label className="employees-gender-label" htmlFor="gender"><b>Geschlecht*</b></label>
                                <select onChange={onChangeGender} className="employees-gender-select" id="gender" name="gender">
                                    <option value="MALE">Mann</option>
                                    <option value="FEMALE">Frau</option>
                                    <option value="DIVERSE">Divers</option>
                                </select>
                        </div>
                        <div className="employees-lg-row">
                            <label className="employees-lg-label" htmlFor="gender"><b>Wohngruppe*</b></label>
                            {livingGroups.length > 0 ?
                                <select onChange={onChangeLivingGroup} className="employees-lg-select" id="livingGroup" name="livingGroup">
                                    {livingGroups.map((lg) => (
                                        <option key={lg.id} value={lg.name}>{lg.name}</option>
                                    ))}
                                </select>
                                :
                                <select onChange={onChangeLivingGroup} className="employees-lg-select" id="livingGroup" name="livingGroup">
                                    <option key="0" value="keine">keine</option>
                                </select>
                            }
                         </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="firstname"><b>Vorname*</b></label>
                        <input onChange={onChangeFirstname} className="employees-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="lastname"><b>Nachname*</b></label>
                        <input onChange={onChangeLastname} className="employees-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="birthday"><b>Geburtstag*</b></label>
                        <input onChange={onChangeBirthday} className="employees-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                    </span>

                </div>

                <div className="employees-create-column-right">

                    <span className="employees-row">
                        <label className="employees-label"><b>Adresse*</b></label>
                        <div className="employees-address-row">
                            <input onChange={onChangeStreet} className="employees-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input onChange={onChangeNumber} className="employees-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                            <input onChange={onChangeZipcode} className="employees-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input onChange={onChangeCity} className="employees-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="phone"><b>Telefon*</b></label>
                        <input onChange={onChangePhone} className="employees-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onChangeEmail} className="employees-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

            <div className="employees-submit-row">
                <button type="button" className="employees-submit" onClick={onCreate}>Anlegen</button>
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