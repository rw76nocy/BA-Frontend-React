import React, { useEffect, useState } from "react";
import '../style/table.input.component.css';
import '../style/input.component.css';
import EmployeesService from '../services/employees.service';
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import AuthService from "../services/auth.service";
import {toast, ToastContainer} from "react-toastify";
import {formatErrorMessage, handleError} from "../utils/utils";

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

    useEffect(async () => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (admin) {
            try {
                const lg = (await LivingGroups.getLivingGroups()).data;
                if (lg[0]) {
                    setLivingGroups(lg);
                    setLivingGroup(lg[0].name);
                }
            } catch (error) {
                handleError(error);
            }
        }

        if (mod) {
            try {
                const account = await Accounts.getAccountById(id);
                const lg = (await LivingGroups.getLivingGroup(account.data.person.livingGroup.name)).data;
                if (lg[0]) {
                    setLivingGroups(lg);
                    setLivingGroup(lg[0].name);
                }
            } catch (error) {
                handleError(error);
            }
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
            toast.error(formatErrorMessage(errors));
            return false;
        } else {
            return true;
        }
    }

    const onCreate = async () => {
        if (validate()) {
            let name = firstname + ' ' + lastname;

            let address = {};
            address.street = street;
            address.number = number;
            address.zipCode = zipcode;
            address.city = city;

            let lg = {};
            lg.name = livingGroup;

            try {
                const response = await EmployeesService.addEmployee(gender, name, phone, fax, email, birthday, address, lg);
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
            <div className="table-input-create-panel">

                <div>
                    <ToastContainer position="bottom-center" autoClose={15000}/>
                </div>

                <div className="table-input-create-column-left">

                    <span className="input-sub-row">
                        <div className="table-input-create-column-left">
                            <label className="input-label" htmlFor="gender"><b>Geschlecht*</b></label>
                                <select value={gender} onChange={onChangeGender} id="gender" name="gender">
                                    <option value="m">Mann (m)</option>
                                    <option value="w">Frau (w)</option>
                                    <option value="d">Divers (d)</option>
                                </select>
                        </div>
                        <div className="table-input-create-column-right">
                            <label className="input-label" htmlFor="gender"><b>Wohngruppe*</b></label>
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

                    <span className="input-row">
                        <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                        <input value={firstname} onChange={onChangeFirstname} className="input-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="lastname"><b>Nachname*</b></label>
                        <input value={lastname} onChange={onChangeLastname} className="input-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="birthday"><b>Geburtstag*</b></label>
                        <input value={birthday} onChange={onChangeBirthday} className="input-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                    </span>

                </div>

                <div className="table-input-create-column-right">

                    <span className="input-row">
                        <label className="input-label"><b>Adresse*</b></label>
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

            <div>
                <button type="button" className="table-input-submit" onClick={onCreate}>Anlegen</button>
            </div>

        </div>
    );
}