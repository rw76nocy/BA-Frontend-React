import React, {useState} from "react";

import '../style/text.input.component.css';

export default function TextInput({title}) {

    return(
        <div className="text-border">
            <div className="text-container">
                <h3><u>{title}</u></h3>
                <div className="text-create-container">
                    <textarea className="text-input" name="text" id="text" cols="70" rows="11" wrap="soft"/>
                </div>
            </div>
        </div>
    );
}