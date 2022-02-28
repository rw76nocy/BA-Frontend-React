import React, { useEffect, useState, useMemo } from "react";
import '../style/employees.component.css';
import EmployeesService from '../services/employees.service';
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import AuthService from "../services/auth.service";

export default function CreateEmployees({reloadTable}) {
    const [gender, setGender] = useState("m");
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
    const [fax, setFax] = useState("");

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (admin) {
            LivingGroups.getLivingGroups().then(response => {
                setLivingGroups(response.data);
                if (response.data[0]) {
                    setLivingGroup(response.data[0].name);
                }
            });
        }

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setLivingGroups(response.data);
                    if (response.data[0]) {
                        setLivingGroup(response.data[0].name);
                    }
                });
            });
        }


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

    const clearInput = () => {
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

        if (errors.length === 0) {
            console.log("Error Array ist hier noch leer");
        }

        if (firstname === "") {
            errors.push("Vorname darf nicht leer sein!");
        }

        if (lastname === "") {
            errors.push("Nachname darf nicht leer sein!");
        }

        if (birthday === "") {
            errors.push("Geburtstag darf nicht unvollständig sein!");
        }

        if (street === "" || number === "" || zipcode === "" || city === "") {
            errors.push("Adresse darf nicht unvollständig sein!");
        }

        if (phone === "") {
            errors.push("Telefon darf nicht leer sein!");
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

            let name = firstname + ' ' + lastname;
            console.log(name);

            let address = {};
            address.street = street;
            address.number = number;
            address.zipCode = zipcode;
            address.city = city;

            let lg = {};
            lg.name = livingGroup;

            console.log(JSON.stringify(address));

            EmployeesService.addEmployee(gender, name, phone, fax, email, birthday, address, lg).then(
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
                });
        }
    }

    return(
        <div>
            <div className="employees-create-panel">

                <div className="employees-create-column-left">

                    <span className="employees-gender-lg-row">
                        <div className="employees-gender-row">
                            <label className="employees-gender-label" htmlFor="gender"><b>Geschlecht*</b></label>
                                <select value={gender} onChange={onChangeGender} id="gender" name="gender">
                                    <option value="m">Mann (m)</option>
                                    <option value="w">Frau (w)</option>
                                    <option value="d">Divers (d)</option>
                                </select>
                        </div>
                        <div className="employees-lg-row">
                            <label className="employees-lg-label" htmlFor="gender"><b>Wohngruppe*</b></label>
                            {livingGroups.length > 0 ?
                                <select value={livingGroup} onChange={onChangeLivingGroup} id="livingGroup" name="livingGroup">
                                    {livingGroups.map((lg) => (
                                        <option key={lg.id} value={lg.name}>{lg.name}</option>
                                    ))}
                                </select>
                                :
                                <select onChange={onChangeLivingGroup} id="livingGroup" name="livingGroup">
                                    <option key="0" value="keine">keine</option>
                                </select>
                            }
                         </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="firstname"><b>Vorname*</b></label>
                        <input value={firstname} onChange={onChangeFirstname} className="employees-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="lastname"><b>Nachname*</b></label>
                        <input value={lastname} onChange={onChangeLastname} className="employees-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="birthday"><b>Geburtstag*</b></label>
                        <input value={birthday} onChange={onChangeBirthday} className="employees-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                    </span>

                </div>

                <div className="employees-create-column-right">

                    <span className="employees-row">
                        <label className="employees-label"><b>Adresse*</b></label>
                        <div className="employees-address-row">
                            <input value={street} onChange={onChangeStreet} className="employees-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input value={number} onChange={onChangeNumber} className="employees-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                            <input value={zipcode} onChange={onChangeZipcode} className="employees-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input value={city} onChange={onChangeCity} className="employees-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="phone"><b>Telefon*</b></label>
                        <input value={phone} onChange={onChangePhone} className="employees-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input value={email} onChange={onChangeEmail} className="employees-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
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