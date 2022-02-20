import React, {useState} from "react";

import '../style/childdoctor.input.component.css';

export default function ChildDoctorInput({title}) {

    return(
        <div className="childdoctor-border">

            <div className="childdoctor-container">
                <h3><u>{title}</u></h3>

                <div className="childdoctor-create-container">

                    <span className="childdoctor-row">
                        <label className="childdoctor-label" htmlFor="name"><b>Name*</b></label>
                        <input className="childdoctor-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="childdoctor-contact-row">
                        <div className="childdoctor-phone-row">
                            <label className="childdoctor-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="childdoctor-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="childdoctor-fax-row">
                            <label className="childdoctor-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="childdoctor-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="childdoctor-row">
                        <label className="childdoctor-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="childdoctor-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}