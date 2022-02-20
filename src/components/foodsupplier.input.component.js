import React, {useState} from "react";

import '../style/foodsupplier.input.component.css';

export default function FoodSupplierInput({title}) {

    return(
        <div className="foodsupplier-border">

            <div className="foodsupplier-container">
                <h3><u>{title}</u></h3>

                <div className="foodsupplier-create-container">

                    <span className="foodsupplier-row">
                        <label className="foodsupplier-label" htmlFor="name"><b>Name*</b></label>
                        <input className="foodsupplier-input" name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="foodsupplier-row">
                        <label className="foodsupplier-label" htmlFor="number"><b>Kundennummer</b></label>
                        <input className="foodsupplier-input" name="number" id="number" type="text" placeholder="Kundennummer"/>
                    </span>

                    <span className="foodsupplier-contact-row">
                        <div className="foodsupplier-phone-row">
                            <label className="foodsupplier-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input className="foodsupplier-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="foodsupplier-fax-row">
                            <label className="foodsupplier-label" htmlFor="phone"><b>Fax</b></label>
                            <input className="foodsupplier-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="foodsupplier-row">
                        <label className="foodsupplier-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="foodsupplier-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}