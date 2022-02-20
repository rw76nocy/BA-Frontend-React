import React, {useState} from "react";

import '../style/healthinsurance.input.component.css';

export default function HealthInsuranceInput({title}) {

    return(
        <div className="healthinsurance-border">

            <div className="healthinsurance-container">
                <h3><u>{title}</u></h3>

                <div className="healthinsurance-create-container">

                    <span className="healthinsurance-row">
                        <label className="healthinsurance-label" htmlFor="name"><b>Name*</b></label>
                        <input className="healthinsurance-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="healthinsurance-holder-number-row">
                        <div className="healthinsurance-holder-row">
                            <label className="healthinsurance-label" htmlFor="holder"><b>Versichert über</b></label>
                            <input className="healthinsurance-input" name="holder" id="holder" type="text" placeholder="Versichert über"/>
                        </div>
                        <div className="healthinsurance-number-row">
                            <label className="healthinsurance-label" htmlFor="number"><b>Versichertennummer</b></label>
                            <input className="healthinsurance-input" name="number" id="number" type="text" placeholder="Versichertennummer"/>
                        </div>
                    </span>

                    <span className="healthinsurance-row">
                        <label className="healthinsurance-label"><b>Adresse</b></label>
                        <div className="healthinsurance-address-row">
                            <input className="healthinsurance-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input className="healthinsurance-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="healthinsurance-address-row">
                            <input className="healthinsurance-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input className="healthinsurance-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="healthinsurance-contact-row">
                        <div className="healthinsurance-phone-row">
                            <label className="healthinsurance-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="healthinsurance-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="healthinsurance-fax-row">
                            <label className="healthinsurance-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="healthinsurance-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                </div>

            </div>


        </div>
    );
}