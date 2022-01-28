import React, { useEffect, useState, useMemo } from "react";
import '../style/employees.component.css';
import EditTable from "./edit.table.component";
import CreateEmployees from "./employees.create.component";
import EmployeesService from '../services/employees.service';
import Trash from "../icons/trash.svg";

export default function Employees() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])
    
    //set data from database
    const fetchData = () => {
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
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;
        address.id = "";
        address.street = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );
    }

    const onBlurNumber = (e,rowIndex) => {
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;
        address.id = "";
        address.number = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );
    }

    const onBlurZipCode = (e,rowIndex) => {
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;
        address.id = "";
        address.zipCode = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );
    }

    const onBlurCity = (e,rowIndex) => {
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let address = temp_element.address;
        address.id = "";
        address.city = e.target.value;
        temp_state[rowIndex] = temp_element;
        setData( temp_state );
    }

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

    return (
        <div className="employees-container">

            <div className="title">
                <h1><u>Mitarbeiter anlegen</u></h1>
            </div>

            <CreateEmployees/>

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

        </div>
    );
}
