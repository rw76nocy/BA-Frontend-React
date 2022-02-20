import React, {useState} from "react";

import '../style/guardian.input.component.css';

export default function GuardianInput({title}) {

    return(
        <div className="guardian-border">

            <div className="guardian-container">
                <h3><u>{title}</u></h3>

                <div className="guardian-create-container">

                    <span className="guardian-row">
                        <label className="guardian-label" htmlFor="name"><b>Name*</b></label>
                        <input className="guardian-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="guardian-contact-row">
                        <div className="guardian-phone-row">
                            <label className="guardian-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="guardian-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="guardian-fax-row">
                            <label className="guardian-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="guardian-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="guardian-row">
                        <label className="guardian-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="guardian-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}