import React, {useEffect, useState} from "react";
import '../style/login.component.css';

import Accounts from '../services/accounts.service';
import AuthService from "../services/auth.service";

export default function Home() {

    const [person, setPerson] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        setIsAdmin(admin);
        let id = AuthService.getCurrentUser().id;

        if (!admin) {
            Accounts.getAccountById(id).then(response => {
                setPerson(response.data.person);
            });
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
