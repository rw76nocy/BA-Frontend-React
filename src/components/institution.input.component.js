import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Institutions from "../services/institution.service";
import {findInstitutionByType, handleError, isJsonEmpty} from "../utils/utils";
import {ToastContainer} from "react-toastify";

export default function InstitutionInput({title, callback, data, disabled}) {

    const [drivers, setDrivers] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState({});
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            let d = {};
            if (title === "Fahrdienst") {
                d = findInstitutionByType(data.institutionRoles, "DRIVER");
            }
            if (!isJsonEmpty(d)) {
                setId(d.id);
                setName(d.name);
                if (d.address) {
                    setAddress(d.address);
                    setStreet(d.address.street);
                    setNumber(d.address.number);
                    setZipcode(d.address.zipCode);
                    setCity(d.address.city);
                } else {
                    setAddress({});
                    setStreet("");
                    setNumber("");
                    setZipcode("");
                    setCity("");
                }
                setPhone(d.phone);
                setFax(d.fax);
                setEmail(d.email);
                sendInputToParent(d.id,d.name,d.address,d.phone,d.fax,d.email);
            } else {
                setId("0");
                setName("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        }
    }, [data, disabled])

    useEffect(async () => {
        try {
            const response = await Institutions.getAllDrivers();
            if (response.data) {
                let drivers = [{ id: 0, name: "keine"}];
                response.data.map(driver => {
                    drivers.push(driver);
                })
                setDrivers(drivers);
            }
        } catch (error) {
            handleError(error);
        }
    }, [])

    const onExistingDriverChange = async (e) => {
        let id = e.target.value;

        try {
            const response = await Institutions.getInstitutionById(id);
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                if (response.data.address) {
                    setAddress(response.data.address);
                    setStreet(response.data.address.street);
                    setNumber(response.data.address.number);
                    setZipcode(response.data.address.zipCode);
                    setCity(response.data.address.city);
                } else {
                    setAddress({});
                    setStreet("");
                    setNumber("");
                    setZipcode("");
                    setCity("");
                }
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id,response.data.name,response.data.address,response.data.phone,response.data.fax,response.data.email);
            } else {
                setId("0");
                setName("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        } catch (error) {
            handleError(error);
        }
    }

    const onNameChange = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,address,phone,fax,email);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
        setAddress(buildAddress(e.target.value,number,zipcode,city));
        sendInputToParent(id,name,buildAddress(e.target.value,number,zipcode,city),phone,fax,email);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
        setAddress(buildAddress(street,e.target.value,zipcode,city));
        sendInputToParent(id,name,buildAddress(street,e.target.value,zipcode,city),phone,fax,email);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
        setAddress(buildAddress(street,number,e.target.value,city));
        sendInputToParent(id,name,buildAddress(street,number,e.target.value,city),phone,fax,email);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
        setAddress(buildAddress(street,number,zipcode,e.target.value));
        sendInputToParent(id,name,buildAddress(street,number,zipcode,e.target.value),phone,fax,email);
    }

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,address,e.target.value,fax,email);
    }

    const onFaxChange = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,address,phone,e.target.value,email);
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        sendInputToParent(id,name,address,phone,fax,e.target.value);
    }

    const buildAddress = (street,number,zipcode,city) => {
        let address = {};
        address.street = street;
        address.number = number;
        address.zipCode = zipcode;
        address.city = city;
        return address;
    }

    const sendInputToParent = (id,name,address,phone,fax,email) => {
        let driver = {};
        driver.id = id;
        driver.name = name;
        driver.address = address;
        driver.phone = phone;
        driver.fax = fax;
        driver.email = email;
        callback(driver);
    }

    const sendEmptyInputToParent = () => {
        let driver = {};
        callback(driver);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    {!disabled &&
                        <span className="input-row">
                            <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                            <select onChange={onExistingDriverChange} className="input-select" value={id} aria-readonly={disabled} id="existing" name="existing">
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                                ))}
                            </select>
                        </span>
                    }

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onNameChange} className="input-input" value={name} readOnly={disabled} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-row">
                        <label className="input-label"><b>Adresse</b></label>
                        <div className="input-address-row">
                            <input onChange={onChangeStreet} className="input-address-street" value={street} readOnly={disabled} name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input onChange={onChangeNumber} className="input-address-number" value={number} readOnly={disabled} name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                        </div>
                        <div className="input-address-row">
                            <input onChange={onChangeZipcode} className="input-address-zipcode" value={zipcode} readOnly={disabled} name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input onChange={onChangeCity} className="input-address-city" value={city} readOnly={disabled} name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onPhoneChange} className="input-input" value={phone} readOnly={disabled} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onFaxChange} className="input-input" value={fax} readOnly={disabled} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onEmailChange} className="input-input" value={email} readOnly={disabled} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

        </div>
    );
}