import React, {useEffect, useMemo, useState} from "react";
import Table from './table.component';
import '../style/table.input.component.css';
import Trash from '../icons/trash.svg';

import LivingGroups from '../services/living.group.service';
import {handleError} from "../utils/utils";
import {toast, ToastContainer} from "react-toastify";

export default function LivingGroup() {

    const [lgName, setLgName] = useState("");
    const [tableData, setTableData] = useState([]);

    useEffect(async () => {
        await fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await LivingGroups.getLivingGroups();
            setTableData(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const onChangeLgName = (e) => {
        setLgName(e.target.value);
    }

    const validate = () => {
        if (lgName) {
            return true;
        } else {
            toast.error("Name der Wohngruppe darf nicht leer sein!");
            return false;
        }
    }

    const onCreate = async () => {
        if (validate()) {
            try {
                const response = await LivingGroups.addLivingGroup(lgName);
                toast.success(response.data.message);
                setLgName("");
                await fetchData();
            } catch (error) {
                handleError(error);
            }
        }
    }

    const onDeleteClick = async (e) => {
        try {
            const response = await LivingGroups.deleteLivingGroup(e.target.value);
            toast.success(response.data.message);
            await fetchData();
        } catch (error) {
            handleError(error);
        }
    }

    const columns = useMemo(
        () => [
            {
                width: 100,
                Header: "Id",
                accessor: "id",
            },
            {
                width: 720,
                Header: "Name",
                accessor: "name",
            },
            {
                width: 80,
                Header: "Aktion",
                accessor: "action",
                Cell: cell => (
                    <input className="table-input-cell"
                           style={{height: 25, width: 25}}
                           type="image"
                           value={cell.row.values.id}
                           src={Trash}
                           alt="löschen"
                           onClick={onDeleteClick}
                    />
                )
            },
        ],
        []
    );

    const data = useMemo(() => tableData, [tableData]);

    return(
        <div className="tableview-container">
            <div className="title">
                <h1><u>Wohngruppe anlegen</u></h1>
            </div>
            <div className="table-input-create-panel">
                <label className="living-group-label" htmlFor="lgname"><b>Name der Wohngruppe</b></label>
                <input className="living-group-input" value={lgName} id="lgname" type="text" onChange={onChangeLgName}/>
                <button type="button" className="living-group-submit" onClick={onCreate}>Anlegen</button>
            </div>
            <div className="title">
                <h1><u>Übersicht Wohngruppen </u></h1>
            </div>
            <Table columns={columns} data={data}/>
        </div>
    );
}