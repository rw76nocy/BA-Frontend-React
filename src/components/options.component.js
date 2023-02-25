import React, { useEffect, useState, useMemo } from "react";
import '../style/table.input.component.css';
import '../style/table.css';
import EditTable from "./edit.table.component";
import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";
import AppointmentService from "../services/appointment.service";
import Trash from "../icons/trash.svg";
import CreateOptions from "./options.create.component";
import {toast, ToastContainer} from "react-toastify";
import {handleError} from "../utils/utils";

export default function Options() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [livingGroup, setLivingGroup] = useState({});

    useEffect(async () => {
        await fetchData();
    }, [])

    //set data from database
    const fetchData = async () => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            try {
                const account = (await Accounts.getAccountById(id)).data;
                const lg = account.person.livingGroup;
                setLivingGroup(lg);
                const dat = (await AppointmentService.getAppointmentTypesByLivingGroup(lg.name)).data;
                setData(dat);
                const ori = (await AppointmentService.getAppointmentTypesByLivingGroup(lg.name)).data;
                setOriginalData(ori);
            } catch (error) {
                handleError(error);
            }
        }
    }

    const onDeleteClick = async (e) => {
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            try {
                const response = await AppointmentService.deleteAppointmentType(e.target.value);
                toast.success(response.data.message);
                await fetchData();
            } catch (error) {
                handleError(error);
            }
        }
    }

    const validateRow = (e) => {
        return e.name !== "";
    }

    const saveData = async () => {
        setOriginalData(data);

        {data.map(async (e) => {
            if (validateRow(e)) {
                try {
                    const response = await AppointmentService.updateAppointmentType(e);
                    toast.success(response.data.message);
                } catch (error) {
                    handleError(error);
                }
            } else {
                toast.error("Werte für Terminart-ID: " + e.id + " sind ungültig!");
            }
        })}
    }

    //reset to original data
    const resetData = async () => {
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (mod) {
            try {
                const account = await Accounts.getAccountById(id);
                const dat = (await AppointmentService.getAppointmentTypesByLivingGroup(account.data.person.livingGroup.name)).data;
                setData(dat);
                toast.success("Erfolreich zurückgesetzt!");
            } catch (error) {
                handleError(error);
            }
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

    const reloadTable = async () => {
        await fetchData();
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

        </div>
    );
}
