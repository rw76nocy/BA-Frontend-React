import React, {useState} from "react";

import '../style/asd.input.component.css';

export default function AsdInput({title}) {

    return(
        <div className="asd-border">

            <div className="asd-container">
                <h3><u>{title}</u></h3>

                <div className="asd-create-container">

                    <span className="asd-row">
                        <label className="asd-label" htmlFor="name"><b>Name*</b></label>
                        <input className="asd-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="asd-row">
                        <label className="asd-label"><b>Jugendamt*</b></label>
                        <input className="asd-input" name="youthoffice" id="youthoffice" type="text" placeholder="Jugendamt"/>
                    </span>

                    <span className="asd-contact-row">
                        <div className="asd-phone-row">
                            <label className="asd-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="asd-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="asd-fax-row">
                            <label className="asd-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="asd-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="asd-row">
                        <label className="asd-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="asd-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}