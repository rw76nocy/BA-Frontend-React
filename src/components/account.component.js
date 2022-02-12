import React, {useEffect, useMemo, useState} from "react";
import Table from './table.component';
import '../style/account.component.css';
import Trash from '../icons/trash.svg';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

export default function Account() {

    const [messageInvalid, setMessageInvalid] = useState("");
    const [message, setMessage] = useState("");
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;
        if (admin) {
            Accounts.getAllAccounts().then(response => {
                setTableData(response.data);
            });
        }
        if (mod) {
            Accounts.getAccountById(id).then(response => {
                Accounts.getUserAccountByLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setTableData(response.data);
                });
            });
        }
    }

    const onDeleteClick = (e) => {
        let confirm = window.confirm("Bist du dir sicher?");
        if (confirm) {
            console.log(e.target.value);
            Accounts.deleteAccount(e.target.value).then(
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
                    <input className="account-cell"
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
        <div className="account-container">
            <div className="title">
                <h1><u>Übersicht Konten </u></h1>
            </div>
            <Table columns={columns} data={data}/>
            <div>
                <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
            </div>
            <div>
                <span style={{color: "green", width: "100%"}}>{message}</span>
            </div>
        </div>
    );
}