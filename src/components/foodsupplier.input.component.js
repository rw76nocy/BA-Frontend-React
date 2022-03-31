import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Institutions from "../services/institution.service";

export default function FoodSupplierInput({title, callback}) {

    const [foodsuppliers, setFoodsuppliers] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [cNumber, setCNumber] = useState("");
    const [pin, setPin] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        Institutions.getAllFoodsuppliers().then(response => {
            if (response.data) {
                console.log(JSON.stringify(response.data));
                let suppliers = [{ id: 0, name: "keine"}];
                response.data.map(supplier => {
                    suppliers.push(supplier);
                })
                setFoodsuppliers(suppliers);
            }
        });
    }, [])

    const onExistingFoodsupplierChange = (e) => {
        let id = e.target.value;

        Institutions.getFoodsupplierById(id).then(response => {
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id,response.data.name,response.data.cnumber,response.data.pin,response.data.phone,response.data.fax,response.data.email);
            } else {
                setId("0");
                setName("");
                setCNumber("");
                setPin("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        });
    }

    const onChangeName = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,cNumber,pin,phone,fax,email);
    }

    const onChangeCNumber = (e) => {
        setCNumber(e.target.value);
        sendInputToParent(id,name,e.target.value,pin,phone,fax,email);
    }

    const onChangePin = (e) => {
        setPin(e.target.value);
        sendInputToParent(id,name,cNumber,e.target.value,phone,fax,email);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,cNumber,pin,e.target.value,fax,email);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,cNumber,pin,phone,e.target.value,email);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
        sendInputToParent(id,name,cNumber,pin,phone,fax,e.target.value);
    }

    const sendInputToParent = (id,name,cNumber,pin,phone,fax,email) => {
        let supplier = {};
        supplier.id = id;
        supplier.name = name;
        supplier.cNumber = cNumber;
        supplier.pin = pin;
        supplier.phone = phone;
        supplier.fax = fax;
        supplier.email = email;
        callback(supplier);
    }

    const sendEmptyInputToParent = () => {
        let supplier = {};
        callback(supplier);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-row">
                        <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                        <select onChange={onExistingFoodsupplierChange} className="input-select" id="existing" name="existing">
                            {foodsuppliers.map((foodsupplier) => (
                                <option key={foodsupplier.id} value={foodsupplier.id}>{foodsupplier.name}</option>
                            ))}
                        </select>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onChangeName} className="input-input" value={name} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="number"><b>Kundennummer</b></label>
                            <input onChange={onChangeCNumber} className="input-input" value={cNumber} name="number" id="number" type="text" placeholder="Kundennummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="pin"><b>PIN</b></label>
                            <input onChange={onChangePin} className="input-input" value={pin} name="pin" id="pin" type="text" placeholder="PIN"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onChangePhone} className="input-input" value={phone} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onChangeFax} className="input-input" value={fax} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onChangeEmail} className="input-input" value={email} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

        </div>
    );
}