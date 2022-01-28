import React, { useEffect, useState, useMemo } from "react";
import '../style/employees.component.css';
import Table from "./table.component";
import EmployeesService from '../services/employees.service';
import EditTable from "./edit.table.component";

import Trash from "../icons/trash.svg";
import LivingGroups from "../services/living.group.service";
export default function Employees() {

    const [gender, setGender] = useState("MALE");
    const [livingGroup, setLivingGroup] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [livingGroups, setLivingGroups] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])
    
    //set data from database
    const fetchData = () => {
        LivingGroups.getLivingGroups().then(response => {
            setLivingGroups(response.data);
            if (response.data[0]) {
                setLivingGroup(response.data[0].name);
            }
        });

        EmployeesService.getEmployees().then(response => {
            setData(response.data);
        });

        EmployeesService.getEmployees().then(response => {
            setOriginalData(response.data);
        });
    }

    const onDeleteClick = (e) => {
        /*alert("Are you sure?");*/
        console.log(e.target.value);
        printData();
        printOriginalData();
    }

    //TODO Hier dann noch die Daten tatsächlich in der Datenbank ändern
    const saveData = () => {
        console.log('Save Data');
        setOriginalData(data);
    }

    //reset to original data
    const resetData = () => {
        console.log('Reset Data');
        EmployeesService.getEmployees().then(response => {
            setData(response.data);
        });
    }

    const printData = () => {
        console.log('Data: ');
        {data.map((obj) => {
            return console.log('object: ' + JSON.stringify(obj));
        })}
    }

    const printOriginalData = () => {
        console.log('Original: ');
        {originalData.map((obj) => {
            return console.log('object: ' + JSON.stringify(obj));
        })}
    }

    const onBlurStreet = (e,rowIndex) => {
        console.log("onBlurStreet!!!");

        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;

        address.id = "";
        address.street = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );
    }

    const onBlurNumber = (e,rowIndex) => {
        console.log("onBlurNumber!!!");

        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;

        address.id = "";
        address.number = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );

    }

    const onBlurZipCode = (e,rowIndex) => {
        console.log("onBlurZipCode!!!");

        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;

        address.id = "";
        address.zipCode = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );

    }

    const onBlurCity = (e,rowIndex) => {
        console.log("onBlurCity!!!");

        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;

        address.id = "";
        address.city = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );

    }

    // columns of the table
    const columns = useMemo(
        () => [
            {
                //non editable cell
                width: 20,
                Header: "Id",
                accessor: "id",
                Cell: ({ value }) => String(value),
                cellWidth: 20,
            },
            {
                width: 30,
                Header: "Geschlecht",
                accessor: "gender",
                Cell: ({ value }) => String(value),
                cellWidth: 30,
            },
            {
                //default editable cell
                width: 300,
                Header: "Name",
                accessor: "name",
                cellWidth: 300,
            },
            {
                width: 100,
                Header: "Geburtstag",
                accessor: "birthday",
                Cell: ({ value }) => String(value),
                cellWidth: 100,
            },
            {
                width: 300,
                Header: 'Straße',
                accessor: 'address.street',
                Cell: ({value, row}) => (
                    <input type="text"
                           style={{width: 300}}
                           defaultValue={value}
                           onBlur={(e) => onBlurStreet(e,row.index)}
                    />
                ),
                cellWidth: 300,
            },
            {
                width: 100,
                Header: 'Nr',
                accessor: 'address.number',
                Cell: ({value, row}) => (
                    <input type="text"
                           style={{width: 100}}
                           defaultValue={value}
                           onBlur={(e) => onBlurNumber(e,row.index)}
                    />
                ),
                cellWidth: 100,
            },
            {
                width: 100,
                Header: 'PLZ',
                accessor: 'address.zipCode',
                Cell: ({value, row}) => (
                    <input type="text"
                           style={{width: 100}}
                           defaultValue={value}
                           onBlur={(e) => onBlurZipCode(e,row.index)}
                    />
                ),
                cellWidth: 100,
            },
            {
                width: 150,
                Header: 'Stadt',
                accessor: 'address.city',
                Cell: ({value, row}) => (
                    <input type="text"
                           style={{width: 150}}
                           defaultValue={value}
                           onBlur={(e) => onBlurCity(e,row.index)}
                    />
                ),
                cellWidth: 150,
            },
            {
                //default editable cell
                width: 200,
                Header: "Telefon",
                accessor: "phone",
                cellWidth: 200,
            },
            {
                //default editable cell
                width: 400,
                Header: "E-Mail",
                accessor: "email",
                cellWidth: 400,
            },
            {
                //default editable cell
                width: 200,
                Header: "Wohngruppe",
                accessor: "livingGroup.name",
                Cell: ({value}) => String(value),
                cellWidth: 200,
            },
            {
                width: 80,
                Header: "Aktion",
                accessor: "action",
                Cell: ({ value, row }) => (
                    <input className="employees-action-cell"
                           style={{height: 25, width: 25}}
                           type="image"
                           value={row.index}
                           src={Trash}
                           alt="löschen"
                           onClick={onDeleteClick}
                    />
                ),
                cellWidth: 80,
            }
        ],
        [onDeleteClick]
   )


    //update if cell value changed
    const updateMyData = (rowIndex, columnId, value) => {
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    const onChangeGender = (e) => {
        setGender(e.target.value);
    }

    const onChangeLivingGroup = (e) => {
        setLivingGroup(e.target.value);
    }

    const onChangeFirstname = (e) => {
        setFirstname(e.target.value);
    }

    const onChangeLastname = (e) => {
        setLastname(e.target.value);
    }

    const onChangeBirthday = (e) => {
        setBirthday(e.target.value);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
    }

    const onChangeZipcode = (e) => {
        setZipcode(e.target.value);
    }

    const onChangeCity = (e) => {
        setCity(e.target.value);
    }

    const onChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const onChangeFax = (e) => {
        setFax(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onCreate = () => {
        console.log(gender);
        console.log(livingGroup);
        console.log(firstname);
        console.log(lastname);
        console.log(birthday);
        console.log(street + ' ' + number + ', ' + zipcode + ' ' + city);
        console.log(phone);
        console.log(fax);
        console.log(email);

        //TODO hier dann employees add service
    }

    return (
        <div className="employees-container">
            <div className="title">
                <h1><u>Mitarbeiter anlegen</u></h1>
            </div>

            <div className="employees-create-panel">

                <div className="employees-create-column-left">

                    <span className="employees-gender-lg-row">
                        <div className="employees-gender-row">
                            <label className="employees-gender-label" htmlFor="gender"><b>Geschlecht*</b></label>
                                <select onChange={onChangeGender} className="employees-gender-select" id="gender" name="gender">
                                    <option value="MALE">Mann</option>
                                    <option value="FEMALE">Frau</option>
                                    <option value="DIVERSE">Divers</option>
                                </select>
                        </div>
                        <div className="employees-lg-row">
                            <label className="employees-lg-label" htmlFor="gender"><b>Wohngruppe*</b></label>
                            {livingGroups.length > 0 ?
                                <select onChange={onChangeLivingGroup} className="employees-lg-select" id="livingGroup" name="livingGroup">
                                    {livingGroups.map((lg) => (
                                        <option key={lg.id} value={lg.name}>{lg.name}</option>
                                    ))}
                                </select>
                                :
                                <select onChange={onChangeLivingGroup} className="employees-lg-select" id="livingGroup" name="livingGroup">
                                    <option key="0" value="keine">keine</option>
                                </select>
                            }
                         </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="firstname"><b>Vorname*</b></label>
                        <input onChange={onChangeFirstname} className="employees-input" name="firstname" id="firstname" type="text" placeholder="Vorname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="lastname"><b>Nachname*</b></label>
                        <input onChange={onChangeLastname} className="employees-input" name="lastname" id="lastname" type="text" placeholder="Nachname"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="birthday"><b>Geburtstag*</b></label>
                        <input onChange={onChangeBirthday} className="employees-input" name="birthday" id="birthday" type="date" placeholder="TT.MM.JJJJ"/>
                    </span>

                </div>

                <div className="employees-create-column-right">

                    <span className="employees-row">
                        <label className="employees-label"><b>Adresse*</b></label>
                        <div className="employees-address-row">
                            <input onChange={onChangeStreet} className="employees-address-street" name="address-street" id="address-street" type="text" placeholder="Straße"/>
                            <input onChange={onChangeNumber} className="employees-address-number" name="address-number" id="address-number" type="text" placeholder="Hausnummer"/>
                            <input onChange={onChangeZipcode} className="employees-address-zipcode" name="address-zipcode" id="address-zipcode" type="text" placeholder="Postleitzahl"/>
                            <input onChange={onChangeCity} className="employees-address-city" name="address-city" id="address-city" type="text" placeholder="Stadt"/>
                        </div>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="phone"><b>Telefon*</b></label>
                        <input onChange={onChangePhone} className="employees-input" name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="fax"><b>Fax</b></label>
                        <input onChange={onChangeFax} className="employees-input" name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                    </span>

                    <span className="employees-row">
                        <label className="employees-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onChangeEmail} className="employees-input" name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>

            <div className="employees-submit-row">
                <button type="button" className="employees-submit" onClick={onCreate}>Anlegen</button>
            </div>

            <div>
                <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
            </div>
            <div>
                <span style={{color: "green", width: "100%"}}>{message}</span>
            </div>

            {/*{tableData.map((lg) => (
                <div key={lg.id}>
                    <span style={{color: "green", width: "100%"}}>{lg.id + ':' +lg.name}</span>
                </div>
            ))}*/}

            <div className="title">
                <h1><u>Übersicht Mitarbeiter </u></h1>
            </div>

            <EditTable columns={columns}
                       data={data}
                       updateMyData={updateMyData}
            />
            <div className="employees-button-row">
                <button className="employees-button-row-save" onClick={saveData}>Speichern</button>
                <button className="employees-button-row-reset" onClick={resetData}>Zurücksetzen</button>
            </div>
            {/*<Table columns={columns} data={data}/>*/}
        </div>
    );
}
