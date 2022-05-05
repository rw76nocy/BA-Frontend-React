import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Institutions from "../services/institution.service";
import {findInstitutionByType, isJsonEmpty, propExist} from "../utils/utils";

export default function HealthInsuranceInput({title, callback, data, disabled}) {

    const [healthinsurances, setHealthinsurances] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [holder, setHolder] = useState("");
    const [cNumber, setCNumber] = useState("");
    const [address, setAddress] = useState({});
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");

    useEffect(() => {
        if (disabled && data !== undefined) {
            let dc = findInstitutionByType(data.institutionRoles, "HEALTHINSURANCE");
            if (!isJsonEmpty(dc)) {
                setId(dc.id);
                setName(dc.name);
                if (data.insured) {
                    setHolder(data.insured.holder);
                    setCNumber(data.insured.customerNumber);
                }
                setAddress(dc.address);
                setStreet(dc.address.street);
                setNumber(dc.address.number);
                setZipcode(dc.address.zipCode);
                setCity(dc.address.city);
                setPhone(dc.phone);
                setFax(dc.fax);
            } else {
                setId("0");
                setName("");
                setHolder("");
                setCNumber("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
            }
        }
    }, [data, disabled])

    useEffect(() => {
        Institutions.getAllHealthinsurances().then(response => {
            if (response.data) {
                let insurances = [{ id: 0, name: "keine"}];
                response.data.map(insurance => {
                    insurances.push(insurance);
                })
                setHealthinsurances(insurances);
            }
        });
    }, [])

    const onExistingInsuranceChange = (e) => {
        let id = e.target.value;

        Institutions.getHealthinsuranceById(id).then(response => {
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                if (response.data.address) {
                    setAddress(buildAddress(response.data.address.street,response.data.address.number,response.data.address.zipCode,response.data.address.city));
                    setStreet(response.data.address.street);
                    setNumber(response.data.address.number);
                    setZipcode(response.data.address.zipCode);
                    setCity(response.data.address.city);
                }
                setPhone(response.data.phone);
                setFax(response.data.fax);
                sendInputToParent(response.data.id,response.data.name,response.data.teacher,response.data.group,response.data.address,response.data.phone,response.data.fax);
            } else {
                setId("0");
                setName("");
                setHolder("");
                setCNumber("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
                sendEmptyInputToParent();
            }
        });
    }

    const onChangeName = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,holder,cNumber,address,phone,fax);
    }
    const onChangeHolder = (e) => {
        setHolder(e.target.value);
        sendInputToParent(id,name,e.target.value,cNumber,address,phone,fax);
    }
    const onChangeCNumber = (e) => {
        setCNumber(e.target.value);
        sendInputToParent(id,name,holder,e.target.value,address,phone,fax);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
        setAddress(buildAddress(e.target.value,number,zipcode,city));
        sendInputToParent(id,name,holder,cNumber,buildAddress(e.target.value,number,zipcode,city),phone,fax);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
        setAddress(buildAddress(street,e.target.value,zipcode,city));
        sendInputToParent(id,name,holder,cNumber,buildAddress(street,e.target.value,zipcode,city),phone,fax);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
        setAddress(buildAddress(street,number,e.target.value,city));
        sendInputToParent(id,name,holder,cNumber,buildAddress(street,number,e.target.value,city),phone,fax);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
        setAddress(buildAddress(street,number,zipcode,e.target.value));
        sendInputToParent(id,name,holder,cNumber,buildAddress(street,number,zipcode,e.target.value),phone,fax);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,holder,cNumber,address,e.target.value,fax);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,holder,cNumber,address,phone,e.target.value);
    }

    const buildAddress = (street,number,zipcode,city) => {
        let address = {};
        address.street = street;
        address.number = number;
        address.zipCode = zipcode;
        address.city = city;
        return address;
    }

    const sendInputToParent = (id,name,holder,cNumber,address,phone,fax) => {
        let insurance = {};
        insurance.id = id;
        insurance.name = name;
        insurance.holder = holder;
        insurance.cNumber = cNumber;
        insurance.address = address;
        insurance.phone = phone;
        insurance.fax = fax;
        if (propExist(this.props.callback)) {
            callback(insurance);
        }
    }

    const sendEmptyInputToParent = () => {
        let insurance = {};
        if (propExist(this.props.callback)) {
            callback(insurance);
        }
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-row">
                        <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                        <select onChange={onExistingInsuranceChange} className="input-select" value={id} aria-readonly={disabled} id="existing" name="existing">
                            {healthinsurances.map((insurance) => (
                                <option key={insurance.id} value={insurance.id}>{insurance.name}</option>
                            ))}
                        </select>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onChangeName} className="input-input" value={name} readOnly={disabled} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="holder"><b>Versichert über</b></label>
                            <input onChange={onChangeHolder} className="input-input" value={holder} readOnly={disabled} name="holder" id="holder" type="text" placeholder="Versichert über"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="number"><b>Versichertennummer</b></label>
                            <input onChange={onChangeCNumber} className="input-input" value={cNumber} readOnly={disabled} name="number" id="number" type="text" placeholder="Versichertennummer"/>
                        </div>
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
                            <input onChange={onChangePhone} className="input-input" value={phone} readOnly={disabled} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onChangeFax} className="input-input" value={fax} readOnly={disabled} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                </div>

            </div>

        </div>
    );
}