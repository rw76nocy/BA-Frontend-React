import React, {useEffect, useState} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import "../style/children.navigation.component.css";
import AuthService from "../services/auth.service";
import Accounts from "../services/accounts.service";
import LivingGroups from "../services/living.group.service";
import ChildrenService from "../services/children.service";

function ChildNav() {

    const [livingGroup, setLivingGroup] = useState("");
    const [children, setChildren] = useState([]);

    useEffect(() => {
        if (AuthService.getCurrentUser()) {
            let user = AuthService.getCurrentUser().roles.includes("ROLE_USER");
            let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
            let id = AuthService.getCurrentUser().id;
            if (user || mod) {
                Accounts.getAccountById(id).then(response => {
                    LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                        setLivingGroup(response.data[0].name)
                        ChildrenService.getChildrenByLivingGroup(response.data[0].name).then(response => {
                            setChildren(response.data);
                        });
                    });
                });
            }
        }
    }, [])

    return (
        <header className="children-nav-header">

            <div className="children-nav-left">
                <ul className="children-navBar">
                    <div className="children-nav-left-panel">
                        <div className="children-nav-left-action-panel">
                            {children.map((c) => (
                                <li key={c.id}>
                                    <Link key={c.id} to={"/child/" + c.id} >{c.firstName} {c.lastName}</Link>
                                </li>
                            ))}
                            </div>
                    </div>
                </ul>
            </div>

            <div className="children-nav-right">
                <ul>
                    <div className="children-nav-right-panel">
                        <li>
                            <Link to="/create">Anlegen</Link>
                        </li>
                    </div>
                </ul>
            </div>

        </header>
    );
}
export default ChildNav;