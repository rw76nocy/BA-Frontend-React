import React, {useState} from "react";

import '../style/input.component.css';

export default function PersonalDataInput({title}) {

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
                            <select className="input-select" name="supervisor1" id="supervisor1">
                                <option value="none">keine</option>
                            </select>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="supervisor2"><b>2.Bezugsbetreuer</b></label>
                            <select className="input-select" name="supervisor2" id="supervisor2">
                                <option value="none">keine</option>
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