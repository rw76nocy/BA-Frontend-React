import React, {useState} from "react";

import '../style/image.input.component.css';

export default function ImageInput({title}) {

    return(
        <div className="image-border">
            <div className="image-container">
                <h3><u>{title}</u></h3>
                <div className="image-create-container">
                    <span className="image-holder">
                        <img className="image-element" name="image-element" id="image-element" alt="Platzhalter"/>
                    </span>
                    <span className="image-row">
                        <input className="image-input" name="image" id="image" type="file"/>
                    </span>
                </div>
            </div>
        </div>
    );
}