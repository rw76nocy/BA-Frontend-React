import React, {useEffect, useState} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import "../style/navigation-bar.component.css";

import ChildNav from './children.navigation.component';

import Home from "./home.component";
import Login from "./login.component";
import Register from "./register.component";
import Profile from "./profile.component";
import BoardUser from "./board-user.component";
import BoardModerator from "./board-moderator.component";
import BoardAdmin from "./board-admin.component";

import AuthService from "../services/auth.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import LivingGroup from "./living-group.component";
import Children from "./children.component";
import Employees from "./employees.component";

function Navbar() {
    const [livingGroup, setLivingGroup] = useState("");
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [childNav, setChildNav] = useState(false);
    const [showChildNav, setShowChildNav] = useState(false);

    useEffect(() => {
        setCurrentUser(AuthService.getCurrentUser());
        if (AuthService.getCurrentUser()) {
            let user = AuthService.getCurrentUser().roles.includes("ROLE_USER");
            let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
            let id = AuthService.getCurrentUser().id;
            if (user || mod) {
                Accounts.getAccountById(id).then(response => {
                    LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                        setLivingGroup(response.data[0].name)
                    });
                });
            }
        }
    }, [])

    useEffect(() => {
        // on component update: refresh roles if user exist
        if (currentUser) {
            let roles = [];
            roles = currentUser.roles;
            if (roles) {
                setShowModeratorBoard(roles.includes("ROLE_MODERATOR"))
                setShowAdminBoard(roles.includes("ROLE_ADMIN"));
            }
        } else {
            setShowModeratorBoard(false);
            setShowAdminBoard(false);
        }
    }, [currentUser])

    useEffect(() => {
        setShowChildNav(childNav);
    }, [childNav])

    const logout = () => {
        deactivateChildNav()
        //clear user from local storage
        AuthService.logout();
        setCurrentUser(undefined);
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
    }

    const changeChildNav = () => {
        if (childNav) {
            setChildNav(false);
        } else {
            setChildNav(true);
        }
    }

    const deactivateChildNav = () => {
        setChildNav(false);
    }

    return (
        <header className="header">

            <div className="first-level">

                <div className="left">
                    <ul>
                        {currentUser ?
                            <div>
                                {showAdminBoard ?
                                    <li>
                                        <div>WG-Administrierung</div>
                                    </li>
                                    :
                                    <li>
                                        <div>Wohngruppe: {livingGroup}</div>
                                    </li>
                                }
                            </div>
                            :
                            <li>
                                <div>WG-Manager</div>
                            </li>
                        }

                    </ul>

                </div>

                <div className="middle">
                    <ul className="navBar">
                        {currentUser ?
                            <div className="middle-panel">
                                {showAdminBoard ?
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/living_group">Wohngruppen</Link>
                                        </li>
                                    </div>
                                    :
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/children" onClick={changeChildNav}>Kinder</Link>
                                        </li>
                                        <li>
                                            <Link to="/profile" onClick={deactivateChildNav}>Profil</Link>
                                        </li>
                                        <li>
                                            <Link to="/appointment" onClick={deactivateChildNav}>Termine</Link>
                                        </li>
                                        <li>
                                            <Link to="/record" onClick={deactivateChildNav}>Ereignisse</Link>
                                        </li>
                                    </div>
                                }

                                {showModeratorBoard || showAdminBoard ?
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/employees" onClick={deactivateChildNav}>Mitarbeiter</Link>
                                        </li>
                                    </div>
                                    :
                                    <div></div>
                                }

                                {showModeratorBoard || showAdminBoard ?
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/accounts" onClick={deactivateChildNav}>Konten</Link>
                                        </li>
                                    </div>
                                    :
                                    <div></div>
                                }
                            </div>
                            :
                            <div></div>
                        }
                    </ul>
                </div>

                <div className="right">
                    <ul>
                        {currentUser ?
                            <div className="right-panel">
                                <li>
                                    <Link to="/login" onClick={logout}>Abmelden</Link>
                                </li>
                                {(showModeratorBoard || showAdminBoard) ?
                                    <li>
                                        <Link to="/register" onClick={deactivateChildNav}>Registrierung</Link>
                                    </li>
                                    :
                                    <div></div>
                                }
                            </div>
                            :
                            <div>
                                <li>
                                    <Link to="/login">Anmelden</Link>
                                </li>
                            </div>
                        }
                    </ul>
                </div>

            </div>

            <div className="second-level">
                {showChildNav ?
                    <div>
                        <ChildNav/>
                        <div>
                            <Routes>
                                <Route path="/create" element={<Children/>} />
                                {/*//TODO edit und delete*/}
                            </Routes>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>

        </header>
    );
}
export default Navbar;