import React, { useEffect, useState, useMemo } from "react";
import '../style/table.input.component.css';
import EditTable from "./edit.table.component";
import CreateEmployees from "./employees.create.component";
import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";
import LivingGroups from '../services/living.group.service';
import EmployeesService from '../services/employees.service';
import Trash from "../icons/trash.svg";
import moment from 'moment';

export default function Employees() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [livingGroups, setLivingGroups] = useState([]);
    const [mod, setMod] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        fetchData();
    }, [])
    
    //set data from database
    const fetchData = () => {
        LivingGroups.getLivingGroups().then(response => {
           setLivingGroups(response.data);
        });

        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let id = AuthService.getCurrentUser().id;

        setMod(mod);
        setAdmin(admin);

        if (admin) {
            EmployeesService.getEmployees().then(response => {
                setData(response.data);
            });

            EmployeesService.getEmployees().then(response => {
                setOriginalData(response.data);
            });
        }

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                EmployeesService.getEmployeesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setData(response.data);
                });
                EmployeesService.getEmployeesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setOriginalData(response.data);
                });
            });
        }
    }

    const onDeleteClick = (e) => {
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            console.log(e.target.value);
            EmployeesService.deleteEmployee(e.target.value).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                    fetchData();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage("");
                    setMessageInvalid(resMessage);
                });
        } else {
            console.log("Abbruch!");
        }
    }

    const validateRow = (e) => {
        if (e.name === "") {
            return false;
        }

        let address = e.address;

        if (address.street === "") {
            return false;
        }

        if (address.number === "") {
            return false;
        }

        if (address.zipCode === "") {
            return false;
        }

        if (address.city === "") {
            return false;
        }

        if (e.phone === "") {
            return false;
        }

        return true;
    }

    const saveData = () => {
        setOriginalData(data);

        {data.map((e) => {
            if (validateRow(e)) {
                EmployeesService.updateEmployee(
                    e.id, e.gender, e.name, e.phone, e.fax, e.email, e.birthday, e.address, e.livingGroup)
                    .then(response => {
                            setMessage(response.data.message);
                            setMessageInvalid("");
                        }, error => {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();
                            setMessageInvalid(resMessage);
                            setMessage("");
                        }
                    )
            } else {
                setMessageInvalid("Werte f??r Mitarbeiter-ID: "+e.id+" sind ung??ltig!");
            }
        })}
    }

    //reset to original data
    const resetData = () => {
        if (admin) {
            EmployeesService.getEmployees().then(response => {
                setData(response.data);
                setMessage("Erfolreich zur??ckgesetzt!")
                setMessageInvalid("");
            }, error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessageInvalid(resMessage);
                setMessage("");
            });
        }

        if (mod) {
            Accounts.getAccountById(AuthService.getCurrentUser().id).then(response => {
                EmployeesService.getEmployeesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setData(response.data);
                    setMessage("Erfolreich zur??ckgesetzt!")
                    setMessageInvalid("");
                }, error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessageInvalid(resMessage);
                    setMessage("");
                });
            });
        }
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

    const onChangeLivingGroup = (e,rowIndex) => {
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        let livingGroup = temp_element.livingGroup;
        livingGroup.id = "";
        livingGroup.name = e.target.value;
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

    const renderLgCell = (value, row) => {
        if (admin) {
            return (
                <select defaultValue={value} onChange={(e) => onChangeLivingGroup(e, row.index)} >
                {livingGroups.map((lg) => (
                    <option key={lg.id} value={lg.name}>{lg.name}</option>
                ))}
                </select>
            )
        } else if (mod) {
            return (
                <select defaultValue={value} onChange={(e) => onChangeLivingGroup(e, row.index)} >
                    <option key={value} value={value}>{value}</option>
                </select>
            )
        }
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
                Header: "Geburtsdatum",
                accessor: "birthday",
                Cell: ({ value }) => {
                    let formatedDate = moment(value).format("DD.MM.YYYY")
                    return String(formatedDate);
                },
                cellWidth: 100,
            },
            {
                width: 300,
                Header: 'Stra??e',
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
                Cell: ({value, row}) => (
                    renderLgCell(value, row)
                ),
                cellWidth: 200,
            },
            {
                width: 80,
                Header: "Aktion",
                accessor: "action",
                Cell: ({ value, row }) => (
                    <input className="table-input-cell"
                           style={{height: 25, width: 25}}
                           type="image"
                           value={row.values.id}
                           src={Trash}
                           alt="l??schen"
                           onClick={onDeleteClick}
                    />
                ),
                cellWidth: 80,
            }
        ],
        [onDeleteClick]
   )

    const reloadTable = () => {
        fetchData();
    }

    return (
        <div className="tableview-container">

            <div className="title">
                <h1><u>Mitarbeiter anlegen</u></h1>
            </div>

            <CreateEmployees reloadTable={reloadTable}/>

            <div className="title">
                <h1><u>??bersicht Mitarbeiter </u></h1>
            </div>

            <EditTable columns={columns}
                       data={data}
                       updateMyData={updateMyData}
            />

            <div>
                <button onClick={saveData}>Speichern</button>
                <button className="employees-button-row-reset" onClick={resetData}>Zur??cksetzen</button>
            </div>

            <div>
                <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
            </div>
            <div>
                <span style={{color: "green", width: "100%"}}>{message}</span>
            </div>

        </div>
    );
}
