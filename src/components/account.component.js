import React, {useEffect, useMemo, useState} from "react";
import Table from './table.component';
import '../style/table.input.component.css';
import Trash from '../icons/trash.svg';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";
import {handleError} from "../utils/utils";
import {toast, ToastContainer} from "react-toastify";

export default function Account() {

    const [tableData, setTableData] = useState([]);

    useEffect(async () => {
        await fetchData();
    }, [])

    const fetchData = async () => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;
        if (admin) {
            try {
                const response = await Accounts.getAllAccounts();
                setTableData(response.data);
            } catch (error) {
                handleError(error);
            }
        }
        if (mod) {
            try {
                const response = await Accounts.getAccountById(id);
                const response2 = await Accounts.getUserAccountByLivingGroup(response.data.person.livingGroup.name);
                setTableData(response2.data);
            } catch (error) {
                handleError(error);
            }
        }
    }

    const onDeleteClick = async (e) => {
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            try {
                const response = await Accounts.deleteAccount(e.target.value);
                toast.success(response.data.message);
                await fetchData();
            } catch (error) {
                handleError(error);
            }
        }
    }

    const columns = useMemo(
        () => [
            {
                width: 920,
                Header: "Konto",
                columns: [
                    {
                        width: 50,
                        Header: "Id",
                        accessor: "id",
                    },
                    {
                        Header: "Benutzername",
                        accessor: "username",
                    },
                    {
                        Header: "E-Mail",
                        accessor: "email",
                    },
                    {
                        Header: "Rolle",
                        accessor: "roles[0].name",
                        Cell: ({value}) => {
                            if (value === "ROLE_USER") {
                                return String("Mitarbeiter");
                            }
                            if (value === "ROLE_MODERATOR") {
                                return String("Teamleiter");
                            }
                            return String(value);
                        }
                    },
                ],
            },
            {
                width: 100,
                Header: " ",
                accessor: "none",
            },
            {
                width: 720,
                Header: "Mitarbeiter",
                columns: [
                    {
                        Header: "Name",
                        accessor: "person.name",
                    },
                    {
                        Header: "Wohngruppe",
                        accessor: "person.livingGroup.name",
                    },
                ],
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
                <h1><u>Übersicht Konten </u></h1>
            </div>
            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
            </div>
            <Table columns={columns} data={data}/>
        </div>
    );
}