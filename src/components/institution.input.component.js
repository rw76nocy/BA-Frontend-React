import React, {useState} from "react";

import '../style/institution.input.component.css';

export default function InstitutionInput({title}) {

    return(
        <div className="institution-border">

            <div className="institution-container">
                <h3><u>{title}</u></h3>

                <div className="institution-create-container">

                    <span className="institution-row">
                        <label className="institution-label" htmlFor="name"><b>Name*</b></label>
                        <input className="institution-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="institution-row">
                        <label className="institution-label"><b>Adresse</b></label>
                        <div className="institution-address-row">
                            <input className="institution-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input className="institution-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="institution-address-row">
                            <input className="institution-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input className="institution-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="institution-contact-row">
                        <div className="institution-phone-row">
                            <label className="institution-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="institution-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="institution-fax-row">
                            <label className="institution-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="institution-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="institution-row">
                        <label className="institution-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="institution-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}