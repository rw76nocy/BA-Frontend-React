import React, {useState} from "react";

import '../style/input.component.css';

export default function PersonInput({title}) {

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input className="input-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="firstname"><b>Nachname*</b></label>
                            <input className="input-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label"><b>Adresse*</b></label>
                        <div className="input-address-row">
                            <input className="input-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input className="input-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="input-address-row">
                            <input className="input-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input className="input-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="input-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="input-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="birthday"><b>Geburtsdatum</b></label>
                            <input className="input-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                            <input className="input-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}