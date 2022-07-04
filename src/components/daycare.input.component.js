import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import Institutions from "../services/institution.service";
import {findInstitutionByType, isJsonEmpty} from "../utils/utils";

export default function DayCareInput({title, callback, data, disabled}) {

    const [daycares, setDaycares] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [teacher, setTeacher] = useState("");
    const [group, setGroup] = useState("");
    const [address, setAddress] = useState({});
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            let dc = findInstitutionByType(data.institutionRoles, "DAYCARE");
            if (!isJsonEmpty(dc)) {
                setId(dc.id);
                setName(dc.name);
                if (data.teach) {
                    setTeacher(data.teach.dayCareTeacher);
                    setGroup(data.teach.dayCareGroup);
                }
                if (dc.address) {
                    setAddress(dc.address);
                    setStreet(dc.address.street);
                    setNumber(dc.address.number);
                    setZipcode(dc.address.zipCode);
                    setCity(dc.address.city);
                } else {
                    setAddress({});
                    setStreet("");
                    setNumber("");
                    setZipcode("");
                    setCity("");
                }
                setPhone(dc.phone);
                setFax(dc.fax);
                sendInputToParent(dc.id,dc.name,data.teach.dayCareTeacher,data.teach.dayCareGroup,dc.address,dc.phone,dc.fax);
            } else {
                setId("0");
                setName("");
                setTeacher("");
                setGroup("");
                setAddress({});
                setStreet("");
                setNumber("");
                setZipcode("");
                setCity("");
                setPhone("");
                setFax("");
                sendEmptyInputToParent();
            }
        }
    }, [data, disabled])

    useEffect(() => {
        Institutions.getAllDaycares().then(response => {
            if (response.data) {
                let cares = [{ id: 0, name: "keine"}];
                response.data.map(care => {
                    cares.push(care);
                })
                setDaycares(cares);
            }
        });
    }, [])

    const onExistingDayCareChange = (e) => {
        let id = e.target.value;

        Institutions.getDaycareById(id).then(response => {
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
                sendInputToParent(response.data.id,response.data.name,teacher,group,response.data.address,response.data.phone,response.data.fax);
            } else {
                setId("0");
                setName("");
                setTeacher("");
                setGroup("");
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
        sendInputToParent(id,e.target.value,teacher,group,address,phone,fax);
    }
    const onChangeTeacher = (e) => {
        setTeacher(e.target.value);
        sendInputToParent(id,name,e.target.value,group,address,phone,fax);
    }
    const onChangeGroup = (e) => {
        setGroup(e.target.value);
        sendInputToParent(id,name,teacher,e.target.value,address,phone,fax);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
        setAddress(buildAddress(e.target.value,number,zipcode,city));
        sendInputToParent(id,name,teacher,group,buildAddress(e.target.value,number,zipcode,city),phone,fax);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
        setAddress(buildAddress(street,e.target.value,zipcode,city));
        sendInputToParent(id,name,teacher,group,buildAddress(street,e.target.value,zipcode,city),phone,fax);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
        setAddress(buildAddress(street,number,e.target.value,city));
        sendInputToParent(id,name,teacher,group,buildAddress(street,number,e.target.value,city),phone,fax);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
        setAddress(buildAddress(street,number,zipcode,e.target.value));
        sendInputToParent(id,name,teacher,group,buildAddress(street,number,zipcode,e.target.value),phone,fax);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,teacher,group,address,e.target.value,fax);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,teacher,group,address,phone,e.target.value);
    }

    const buildAddress = (street,number,zipcode,city) => {
        let address = {};
        address.street = street;
        address.number = number;
        address.zipCode = zipcode;
        address.city = city;
        return address;
    }

    const sendInputToParent = (id,name,teacher,group,address,phone,fax) => {
        let daycare = {};
        daycare.id = id;
        daycare.name = name;
        daycare.address = address;
        daycare.phone = phone;
        daycare.fax = fax;
        daycare.email = "";
        daycare.teacher = teacher;
        daycare.group = group;
        callback(daycare);
    }

    const sendEmptyInputToParent = () => {
        let care = {};
        callback(care);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    {!disabled &&
                        <span className="input-row">
                            <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                            <select onChange={onExistingDayCareChange} className="input-select" value={id} aria-readonly={disabled} id="existing" name="existing">
                                {daycares.map((care) => (
                                    <option key={care.id} value={care.id}>{care.name}</option>
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
                            <label className="input-label" htmlFor="teacher"><b>Erzieher</b></label>
                            <input onChange={onChangeTeacher} className="input-input" value={teacher} readOnly={disabled} name="teacher" id="teacher" type="text" placeholder="Erzieher"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="group"><b>Gruppe</b></label>
                            <input onChange={onChangeGroup} className="input-input" value={group} readOnly={disabled} name="group" id="group" type="text" placeholder="Gruppe"/>
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