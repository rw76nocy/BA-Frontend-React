import React, {useState} from "react";

import '../style/daycare.input.component.css';

export default function DayCareInput({title}) {

    return(
        <div className="daycare-border">

            <div className="daycare-container">
                <h3><u>{title}</u></h3>

                <div className="daycare-create-container">

                    <span className="daycare-row">
                        <label className="daycare-label" htmlFor="name"><b>Name*</b></label>
                        <input className="daycare-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="daycare-teacher-group-row">
                        <div className="daycare-teacher-row">
                            <label className="daycare-label" htmlFor="teacher"><b>Erzieher</b></label>
                            <input className="daycare-input" name="teacher" id="teacher" type="text" placeholder="Erzieher"/>
                        </div>
                        <div className="daycare-group-row">
                            <label className="daycare-label" htmlFor="group"><b>Gruppe</b></label>
                            <input className="daycare-input" name="group" id="group" type="text" placeholder="Gruppe"/>
                        </div>
                    </span>

                    <span className="daycare-row">
                        <label className="daycare-label"><b>Adresse</b></label>
                        <div className="daycare-address-row">
                            <input className="daycare-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input className="daycare-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="daycare-address-row">
                            <input className="daycare-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input className="daycare-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="daycare-contact-row">
                        <div className="daycare-phone-row">
                            <label className="daycare-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="daycare-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="daycare-fax-row">
                            <label className="daycare-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="daycare-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}