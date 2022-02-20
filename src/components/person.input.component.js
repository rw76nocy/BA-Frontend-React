import React, {useState} from "react";

import '../style/person.input.component.css';

export default function PersonInput({title}) {

    return(
        <div className="person-border">

            <div className="person-container">
                <h3><u>{title}</u></h3>

                <div className="person-create-container">

                    <span className="person-name-row">
                        <div className="person-firstname-row">
                            <label className="person-label" htmlFor="firstname"><b>Vorname*</b></label>
                            <input className="person-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                        </div>
                        <div className="person-lastname-row">
                            <label className="person-label" htmlFor="firstname"><b>Nachname*</b></label>
                            <input className="person-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                        </div>
                    </span>

                    <span className="person-row">
                        <label className="person-label"><b>Adresse*</b></label>
                        <div className="person-address-row">
                            <input className="person-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input className="person-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="person-address-row">
                            <input className="person-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input className="person-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="person-contact-row">
                        <div className="person-phone-row">
                            <label className="person-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="person-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="person-fax-row">
                            <label className="person-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="person-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="person-birthday-email-row">
                        <div className="person-birthday-row">
                            <label className="person-label" htmlFor="birthday"><b>Geburtsdatum</b></label>
                            <input className="person-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                        </div>
                        <div className="person-email-row">
                            <label className="person-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                            <input className="person-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}