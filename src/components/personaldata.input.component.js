import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import AuthService from "../services/auth.service";
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";
import Accounts from "../services/accounts.service";

export default function PersonalDataInput({title}) {

    const [livingGroup, setLivingGroup] = useState("");
    const [employee1, setEmployee1] = useState("");
    const [employee2, setEmployee2] = useState("");
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        let id = AuthService.getCurrentUser().id;

        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    setLivingGroup(response.data[0].name);
                    Employees.getAllEmployeesByLivingGroup(response.data[0].name).then(response => {
                        setEmployees(response.data);
                        if (response.data[0]) {
                            setEmployee1(response.data[0].id);
                            setEmployee2(response.data[0].id);
                        } else {
                            setEmployee1("");
                            setEmployee2("");
                        }
                    });
                }
            });
        });

    }, [])

    const onChangeEmployee1 = (e) => {
        setEmployee1(e.target.value);
        console.log(e.target.value);
    }

    const onChangeEmployee2 = (e) => {
        setEmployee2(e.target.value);
        console.log(e.target.value);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="gender"><b>Geschlecht*</b></label>
                            <select className="input-select" name="gender" id="gender">
                                <option value="male">m</option>
                                <option value="female">w</option>
                                <option value="diverse">d</option>
                            </select>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="birthday"><b>Geburtsddatum*</b></label>
                            <input className="input-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input className="input-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="lastname"><b>Nachname*</b></label>
                            <input className="input-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="supervisor1"><b>1.Bezugsbetreuer</b></label>
                            <select onChange={onChangeEmployee1} className="input-select" id="supervisor1" name="supervisor1">
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="supervisor2"><b>2.Bezugsbetreuer</b></label>
                            <select onChange={onChangeEmployee2} className="input-select" id="supervisor2" name="supervisor2">
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="entrance"><b>Aufnahmedatum*</b></label>
                            <input className="input-input" name="entrance" id="entrance" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="release"><b>Entlassungsdatum</b></label>
                            <input className="input-input" name="release" id="release" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}