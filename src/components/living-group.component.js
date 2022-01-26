import React, {useEffect, useMemo, useState} from "react";
import Table from './table.component';
import '../style/living-group.component.css';
import Trash from '../icons/trash.svg';

import LivingGroups from '../services/living.group.service';

export default function LivingGroup() {

    const [lgName, setLgName] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");
    const [message, setMessage] = useState("");
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        LivingGroups.getLivingGroups().then(response => {
            setTableData(response.data);
        });
    }

    const onChangeLgName = (e) => {
        setLgName(e.target.value);
    }

    const validate = () => {
        if (lgName) {
            setMessageInvalid("");
            return true;
        } else {
            setMessageInvalid("Name der Wohngruppe darf nicht leer sein!");
            setMessage("");
            return false;
        }
    }

    const onCreate = () => {
        if (validate()) {
            LivingGroups.addLivingGroup(lgName).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                    setLgName("");
                    fetchData();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessageInvalid(resMessage);
                });
        }
    }

    const onDeleteClick = (e) => {
        LivingGroups.deleteLivingGroup(e.target.value).then(
            response => {
                setMessage(response.data.message)
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
                setMessageInvalid(resMessage);
            })
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
                    <input className="cell"
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
        <div className="living-group-container">

            <div className="title">
                <h1><u>Wohngruppe anlegen</u></h1>
            </div>
            <div className="living-group-create-panel">
                <label className="label" htmlFor="lgname"><b>Name der Wohngruppe</b></label>
                <input className="input" value={lgName} id="lgname" type="text" onChange={onChangeLgName}/>
                <button type="button" className="submit" onClick={onCreate}>Anlegen</button>
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
                <h1><u>Übersicht Wohngruppen </u></h1>
            </div>
            <Table columns={columns} data={data}/>
        </div>
    );
}