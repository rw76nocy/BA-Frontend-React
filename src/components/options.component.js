import React, { useEffect, useState, useMemo } from "react";
import '../style/table.input.component.css';
import '../style/table.css';
import EditTable from "./edit.table.component";
import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";
import AppointmentService from "../services/appointment.service";
import Trash from "../icons/trash.svg";
import CreateOptions from "./options.create.component";

export default function Options() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [livingGroup, setLivingGroup] = useState({});

    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        fetchData();
    }, [])

    //set data from database
    const fetchData = () => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                setLivingGroup(response.data.person.livingGroup);
                AppointmentService.getAppointmentTypesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setData(response.data);
                });
                AppointmentService.getAppointmentTypesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setOriginalData(response.data);
                });
            });
        }
    }

    const onDeleteClick = (e) => {
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            AppointmentService.deleteAppointmentType(e.target.value).then(
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
        }
    }

    const validateRow = (e) => {
        if (e.name === "") {
            return false;
        }
        return true;
    }

    const saveData = () => {
        setOriginalData(data);

        {data.map((e) => {
            if (validateRow(e)) {
                AppointmentService.updateAppointmentType(e).then(
                    response => {
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
                    });
            } else {
                setMessageInvalid("Werte für Terminart-ID: "+e.id+" sind ungültig!");
            }
        })}
    }

    //reset to original data
    const resetData = () => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                AppointmentService.getAppointmentTypesByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setData(response.data);
                    setMessage("Erfolreich zurückgesetzt!")
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

    const onChangeColor = (e,rowIndex) => {
        let temp_state = [...data];
        let temp_element = { ...temp_state[rowIndex] };
        temp_element.color = e.target.value;
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

    const renderColorPickerCell = (value, row) => {
        return (
            <input onChange={(e) => onChangeColor(e, row.index)} className="input-input" name="color" id="color" type="color" value={value}/>
        );
    }

    const renderDeleteAction = (row) => {
        if (isNotDefaultType(row)) {
            return (
                <input className="table-input-cell"
                       style={{height: 25, width: 25}}
                       type="image"
                       value={row.values.id}
                       src={Trash}
                       alt="löschen"
                       onClick={onDeleteClick}
                />
            );
        }
        return String("");
    }

    const isNotDefaultType = (row) => {
        let defaultTypeId = livingGroup.defaultType.id;
        return defaultTypeId !== row.values.id;

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
                //default editable cell
                width: 1300,
                Header: "Terminart",
                accessor: "name",
                cellWidth: 1300,
            },
            {
                //default editable cell
                width: 200,
                Header: "Farbe",
                accessor: "color",
                Cell: ({value, row}) => (
                    renderColorPickerCell(value, row)
                ),
                cellWidth: 200,
            },
            {
                width: 80,
                Header: "Aktion",
                accessor: "action",
                Cell: ({ row }) => (
                    renderDeleteAction(row)
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
                <h1><u>Terminart anlegen</u></h1>
            </div>

            <CreateOptions reloadTable={reloadTable}/>

            <div className="title">
                <h1><u>Übersicht Terminarten </u></h1>
            </div>

            <EditTable columns={columns}
                       data={data}
                       updateMyData={updateMyData}
            />

            <div>
                <button onClick={saveData}>Speichern</button>
                <button className="employees-button-row-reset" onClick={resetData}>Zurücksetzen</button>
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
