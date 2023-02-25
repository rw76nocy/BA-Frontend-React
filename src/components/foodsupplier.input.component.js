import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Institutions from "../services/institution.service";
import {findInstitutionByType, handleError, isJsonEmpty} from "../utils/utils";
import {ToastContainer} from "react-toastify";

export default function FoodSupplierInput({title, callback, data, disabled}) {

    const [foodsuppliers, setFoodsuppliers] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [cNumber, setCNumber] = useState("");
    const [pin, setPin] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            let fs = findInstitutionByType(data.institutionRoles, "FOODSUPPLIER");
            if (!isJsonEmpty(fs)) {
                setId(fs.id);
                setName(fs.name);
                if (data.supply) {
                    setCNumber(data.supply.customerNumber);
                    setPin(data.supply.pin);
                }
                setPhone(fs.phone);
                setFax(fs.fax);
                setEmail(fs.email);
                sendInputToParent(fs.id,fs.name,data.supply.customerNumber,data.supply.pin,fs.phone,fs.fax,fs.email);
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
        }
    }, [data, disabled])

    useEffect(async () => {
        try {
            const response = await Institutions.getAllFoodsuppliers();
            if (response.data) {
                let suppliers = [{ id: 0, name: "keine"}];
                response.data.map(supplier => {
                    suppliers.push(supplier);
                })
                setFoodsuppliers(suppliers);
            }
        } catch (error) {
            handleError(error);
        }
    }, [])

    const onExistingFoodsupplierChange = async (e) => {
        let id = e.target.value;

        try {
            const response = await Institutions.getFoodsupplierById(id);
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id, response.data.name, response.data.cnumber, response.data.pin, response.data.phone, response.data.fax, response.data.email);
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
        } catch (error) {
            handleError(error);
        }
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

                    {!disabled &&
                        <span className="input-row">
                            <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                            <select onChange={onExistingFoodsupplierChange} className="input-select" value={id} aria-readonly={disabled} id="existing" name="existing">
                                {foodsuppliers.map((foodsupplier) => (
                                    <option key={foodsupplier.id} value={foodsupplier.id}>{foodsupplier.name}</option>
                                ))}
                            </select>
                        </span>
                    }

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onChangeName} className="input-input" value={name} readOnly={disabled} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="number"><b>Kundennummer</b></label>
                            <input onChange={onChangeCNumber} className="input-input" value={cNumber} readOnly={disabled} name="number" id="number" type="text" placeholder="Kundennummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="pin"><b>PIN</b></label>
                            <input onChange={onChangePin} className="input-input" value={pin} readOnly={disabled} name="pin" id="pin" type="text" placeholder="PIN"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onChangePhone} className="input-input" value={phone} readOnly={disabled} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onChangeFax} className="input-input" value={fax} readOnly={disabled} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onChangeEmail} className="input-input" value={email} readOnly={disabled} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

        </div>
    );
}