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
import {handleError} from "../utils/utils";
import {toast, ToastContainer} from "react-toastify";

export default function Employees() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [livingGroups, setLivingGroups] = useState([]);
    const [mod, setMod] = useState(false);
    const [management, setManagement] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(async () => {
        await fetchData();
    }, [])
    
    //set data from database
    const fetchData = async () => {
        try {
            const lg = await LivingGroups.getLivingGroups();
            setLivingGroups(lg.data);
        } catch (error) {
            handleError(error);
        }

        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let management = AuthService.getCurrentUser().roles.includes("ROLE_MANAGEMENT");
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let id = AuthService.getCurrentUser().id;

        setMod(mod);
        setManagement(management);
        setAdmin(admin);

        if (admin || management) {
            try {
                const dat = await EmployeesService.getEmployees();
                const ori = await EmployeesService.getEmployees();

                if (management) {
                    const account = await Accounts.getAccountById(id);
                    const dat1 = dat.data.filter(a => a.id !== account.data.person.id);
                    setData(dat1);
                    const ori1 = ori.data.filter(a => a.id !== account.data.person.id);
                    setData(ori1);
                } else {
                    setData(dat.data);
                    setData(ori.data);
                }
            } catch (error) {
                handleError(error);
            }
        }

        if (mod) {
            try {
                const account = await Accounts.getAccountById(id);
                const dat = await EmployeesService.getEmployeesByLivingGroup(account.data.person.livingGroup.name);
                setData(dat.data);
                const ori = await EmployeesService.getEmployeesByLivingGroup(account.data.person.livingGroup.name);
                setData(ori.data);
            } catch (error) {
                handleError(error);
            }
        }
    }

    const onDeleteClick = async (e) => {
        //TODO Modal-Dialog einbauen
        // wenn Mitarbeiter noch Bezugsbetreuer ist oder Termine in der Zukunft hat
        // Bei Kindern: Hinweis das man erst die Zuweisung ändern soll -> Nicht löschen!
        // Bei Terminen: Fragen ob man ihn trotzdem löschen will? ja: -> löschen, nein -> nicht löschen!
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            try {
                const response = await EmployeesService.deleteEmployee(e.target.value);
                toast.success(response.data.message);
                await fetchData()
            } catch (error) {
                handleError(error);
            }
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

    const saveData = async () => {
        setOriginalData(data);

        {data.map(async (e) => {
            if (validateRow(e)) {
                try {
                    const response = await EmployeesService.updateEmployee(
                        e.id, e.gender, e.name, e.phone, e.fax, e.email, e.birthday, e.address, e.livingGroup)
                    toast.success(response.data.message);
                } catch (error) {
                    handleError(error);
                }
            } else {
                toast.error("Werte für Mitarbeiter-ID: " + e.id + " sind ungültig!");
            }
        })}
    }

    //reset to original data
    const resetData = async () => {
        if (admin || management) {
            try {
                const emps = await EmployeesService.getEmployees();
                if (management) {
                    let id = AuthService.getCurrentUser().id;
                    const account = await Accounts.getAccountById(id);
                    const emps1 = emps.data.filter(a => a.id !== account.data.person.id);
                    setData(emps1);
                } else {
                    setData(emps.data);
                }
                toast.success("Erfolreich zurückgesetzt!");
            } catch (error) {
                handleError(error);
            }
        }

        if (mod) {
            try {
                const account = await Accounts.getAccountById(AuthService.getCurrentUser().id);
                const emps = await EmployeesService.getEmployeesByLivingGroup(account.data.person.livingGroup.name);
                setData(emps.data);
                toast.success("Erfolreich zurückgesetzt!");
            } catch (error) {
                handleError(error);
            }
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
        if (admin || management) {
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
                           alt="löschen"
                           onClick={onDeleteClick}
                    />
                ),
                cellWidth: 80,
            }
        ],
        [onDeleteClick]
   )

    const reloadTable = async () => {
        await fetchData();
    }

    return (
        <div className="tableview-container">

            <div className="title">
                <h1><u>Mitarbeiter anlegen</u></h1>
            </div>

            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
            </div>

            <CreateEmployees reloadTable={reloadTable}/>

            <div className="title">
                <h1><u>Übersicht Mitarbeiter </u></h1>
            </div>

            <EditTable columns={columns}
                       data={data}
                       updateMyData={updateMyData}
            />

            <div>
                <button onClick={saveData}>Speichern</button>
                <button className="employees-button-row-reset" onClick={resetData}>Zurücksetzen</button>
            </div>

        </div>
    );
}
