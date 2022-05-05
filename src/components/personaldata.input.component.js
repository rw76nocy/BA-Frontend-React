import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import AuthService from "../services/auth.service";
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";
import Accounts from "../services/accounts.service";
import {findPersonByType} from "../utils/utils";

export default function PersonalDataInput({title, callback, data, disabled}) {

    const [livingGroup, setLivingGroup] = useState("");
    const [employees, setEmployees] = useState([]);

    const [gender, setGender] = useState("male");
    const [birthday, setBirthday] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [employee1, setEmployee1] = useState("");
    const [employee2, setEmployee2] = useState("");
    const [entrance, setEntrance] = useState("");
    const [release, setRelease] = useState("");

    useEffect(() => {
        if (disabled && data !== undefined) {
            setGender(data.gender.toLowerCase());
            setBirthday(data.birthday);
            setFirstname(data.firstName);
            setLastname(data.lastName);
            let p1 = findPersonByType(data.personRoles,"SUPERVISOR1");
            let p2 = findPersonByType(data.personRoles,"SUPERVISOR2");
            setEmployee1(p1.name);
            setEmployee2(p2.name);
            setEntrance(data.entranceDate);
            setRelease(data.releaseDate);
        }
    }, [data, disabled])

    useEffect(() => {
        let id = AuthService.getCurrentUser().id;

        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    setLivingGroup(response.data[0].name);
                    Employees.getAllEmployeesByLivingGroup(response.data[0].name).then(response => {
                        console.log(JSON.stringify(response.data));
                        setEmployees(response.data);
                        if (response.data[0]) {
                            setEmployee1(response.data[0].name);
                            setEmployee2(response.data[0].name);
                            sendInputToParent(gender,birthday,firstname,lastname,response.data[0].name,response.data[0].name,entrance,release);
                        } else {
                            setEmployee1("");
                            setEmployee2("");
                            sendInputToParent(gender,birthday,firstname,lastname,"","",entrance,release);
                        }
                    });
                }
            });
        });

    }, [])

    const onChangeGender = (e) => {
        setGender(e.target.value);
        sendInputToParent(e.target.value,birthday,firstname,lastname,employee1,employee2,entrance,release);
    }

    const onChangeBirthday = (e) => {
        setBirthday(e.target.value);
        sendInputToParent(gender,e.target.value,firstname,lastname,employee1,employee2,entrance,release);
    }

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
        sendInputToParent(gender,birthday,e.target.value,lastname,employee1,employee2,entrance,release);
    }

    const onChangeLastname = (e) => {
        setLastname(e.target.value);
        sendInputToParent(gender,birthday,firstname,e.target.value,employee1,employee2,entrance,release);
    }

    const onChangeEmployee1 = (e) => {
        setEmployee1(e.target.value);
        sendInputToParent(gender,birthday,firstname,lastname,e.target.value,employee2,entrance,release);
    }

    const onChangeEmployee2 = (e) => {
        setEmployee2(e.target.value);
        sendInputToParent(gender,birthday,firstname,lastname,employee1,e.target.value,entrance,release);
    }

    const onChangeEntrance = (e) => {
        setEntrance(e.target.value);
        sendInputToParent(gender,birthday,firstname,lastname,employee1,employee2,e.target.value,release);
    }

    const onChangeRelease = (e) => {
        setRelease(e.target.value);
        sendInputToParent(gender,birthday,firstname,lastname,employee1,employee2,entrance,e.target.value);
    }

    const sendInputToParent = (gender,birthday,firstname,lastname,supervisor1,supervisor2,entrance,release) => {
        let personal = {};
        personal.gender = gender;
        personal.birthday = birthday;
        personal.firstname = firstname;
        personal.lastname = lastname;
        personal.supervisor1 = supervisor1;
        personal.supervisor2 = supervisor2;
        personal.entrance = entrance;
        personal.release = release;
        callback(personal);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="gender"><b>Geschlecht*</b></label>
                            <select onChange={onChangeGender} className="input-select" value={gender} aria-readonly={disabled} name="gender" id="gender">
                                <option value="male">m</option>
                                <option value="female">w</option>
                                <option value="diverse">d</option>
                            </select>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="birthday"><b>Geburtsddatum*</b></label>
                            <input onChange={onChangeBirthday} className="input-input" value={birthday} readOnly={disabled} name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input onChange={onChangeFirstname} className="input-input" value={firstname} readOnly={disabled} name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="lastname"><b>Nachname*</b></label>
                            <input onChange={onChangeLastname} className="input-input" value={lastname} readOnly={disabled} name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="supervisor1"><b>1.Bezugsbetreuer</b></label>
                            <select onChange={onChangeEmployee1} className="input-select" value={employee1} aria-readonly={disabled} id="supervisor1" name="supervisor1">
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="supervisor2"><b>2.Bezugsbetreuer</b></label>
                            <select onChange={onChangeEmployee2} className="input-select" value={employee2} aria-readonly={disabled} id="supervisor2" name="supervisor2">
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="entrance"><b>Aufnahmedatum*</b></label>
                            <input onChange={onChangeEntrance} className="input-input" value={entrance} readOnly={disabled} name="entrance" id="entrance" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="release"><b>Entlassungsdatum</b></label>
                            <input onChange={onChangeRelease} className="input-input" value={release} readOnly={disabled} name="release" id="release" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}