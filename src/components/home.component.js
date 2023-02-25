import React, {useEffect, useState} from "react";
import '../style/login.component.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";
import {handleError} from "../utils/utils";
import {ToastContainer} from "react-toastify";

export default function Home() {

    const [person, setPerson] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(async () => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        setIsAdmin(admin);
        let id = AuthService.getCurrentUser().id;

        if (!admin) {
            try {
                const account = await Accounts.getAccountById(id);
                setPerson(account.data.person);
            } catch (error) {
                handleError(error);
            }
        }
    },[])

    return (
        <div className="login-title">
            {isAdmin ?
                <h1>Herzlich Willkommen Administrator</h1>
                :
                <h1>{"Herzlich Willkommen " + person.name}</h1>
            }
        </div>
    );
}
