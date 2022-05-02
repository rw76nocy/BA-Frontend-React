import React, {useState} from "react";

import '../style/input.component.css';
import Trash from "../icons/trash.svg";

export default function ImageInput({title, callback}) {

    const [image, setImage] = useState();
    const [imagePreview, setImagePreview] = useState("");
    const [inputkey, setInputKey] = useState("");

    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
            callback(e.target.files[0]);
            console.log(e.target.files[0]);
        }
    }

    const onDeleteClick = () => {
        setImage(undefined);
        setInputKey(Date.now);
        callback(undefined);
    }

    return(
        <div className="input-border">
            <div className="image-container">
                <h3><u>{title}</u></h3>
                <div className="image-create-container">
                    <span className="image-holder">
                        <img className="image-element" name="image-element" id="image-element" src={imagePreview} alt="Hier kann ein Foto eingefügt werden"/>
                    </span>
                    <span className="image-row">
                        <input onChange={onImageChange} className="image-input" key={inputkey} name="image" id="image" type="file"/>
                        <input className="image-delete"
                               type="image"
                               src={Trash}
                               alt="löschen"
                               onClick={onDeleteClick}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}