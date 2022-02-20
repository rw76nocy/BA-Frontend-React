import React, {useState} from "react";

import '../style/personaldata.input.component.css';

export default function PersonalDataInput({title}) {

    return(
        <div className="personaldata-border">

            <div className="personaldata-container">
                <h3><u>{title}</u></h3>

                <div className="personaldata-create-container">

                    <span className="personaldata-gender-birthday-row">
                        <div className="personaldata-gender-row">
                            <label className="personaldata-label" htmlFor="gender"><b>Geschlecht*</b></label>
                            <select className="personaldata-select" name="gender" id="gender">
                                <option value="male">m</option>
                                <option value="female">w</option>
                                <option value="diverse">d</option>
                            </select>
                        </div>
                        <div className="personaldata-birthday-row">
                            <label className="personaldata-label" htmlFor="birthday"><b>Geburtsddatum*</b></label>
                            <input className="person-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                    <span className="personaldata-name-row">
                        <div className="personaldata-firstname-row">
                            <label className="personaldata-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input className="personaldata-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="personaldata-lastname-row">
                            <label className="personaldata-label" htmlFor="lastname"><b>Nachname*</b></label>
                            <input className="personaldata-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="personaldata-supervisor-row">
                        <div className="personaldata-supervisor1-row">
                            <label className="personaldata-label" htmlFor="supervisor1"><b>1.Bezugsbetreuer</b></label>
                            <select className="personaldata-select" name="supervisor1" id="supervisor1">
                                <option value="none">keine</option>
                            </select>
                        </div>
                        <div className="personaldata-supervisor2-row">
                            <label className="personaldata-label" htmlFor="supervisor2"><b>2.Bezugsbetreuer</b></label>
                            <select className="personaldata-select" name="supervisor2" id="supervisor2">
                                <option value="none">keine</option>
                            </select>
                        </div>
                    </span>

                    <span className="personaldata-date-row">
                        <div className="personaldata-entrance-row">
                            <label className="personaldata-label" htmlFor="entrance"><b>Aufnahmedatum*</b></label>
                            <input className="person-input" name="entrance" id="entrance" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="personaldata-release-row">
                            <label className="personaldata-label" htmlFor="release"><b>Entlassungsdatum</b></label>
                            <input className="person-input" name="release" id="release" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}