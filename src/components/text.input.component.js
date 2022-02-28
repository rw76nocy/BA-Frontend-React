import React, {useState} from "react";

import '../style/input.component.css';

export default function TextInput({title}) {

    return(
        <div className="input-border">
            <div className="input-container">
                <h3><u>{title}</u></h3>
                <div className="input-create-container">
                    <textarea className="textarea-input" name="text" id="text" cols="70" rows="11" wrap="soft"/>
                </div>
            </div>
        </div>
    );
}