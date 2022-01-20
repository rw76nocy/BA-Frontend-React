import React, {useEffect, useState} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import "../style/navigation-bar.component.css";
import Home from "./home.component";
import Login from "./login.component";
import Register from "./register.component";
import Profile from "./profile.component";
import BoardUser from "./board-user.component";
import BoardModerator from "./board-moderator.component";
import BoardAdmin from "./board-admin.component";

import AuthService from "../services/auth.service";

function Navbar(props) {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser);
    const [showModeratorBoard, setShowModeratorBoard] = useState(props.showModeratorBoard);
    const [showAdminBoard, setShowAdminBoard] = useState(props.showAdminBoard);

    useEffect(() => {
        // on component update: refresh roles if user exist
        if (currentUser) {
            if (currentUser.roles){
                setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"))
                setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
            } else {
                setShowModeratorBoard(false);
                setShowAdminBoard(false);
            }
        }
    })

    const logout = () => {
        //clear user from local storage
        AuthService.logout();
        setCurrentUser(null);
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
    }

    return (
        <header className="header">

            <div className="left">
                <ul>
                    {currentUser ?
                        <div>
                            {showAdminBoard ?
                                <li>
                                    <a href="#">WG-Administrierung</a>
                                </li>
                                :
                                <li>
                                    <a href="#">Wohngruppe: Phoenix</a>
                                </li>
                            }
                        </div>
                        :
                        <li>
                            <a href="#">WG-Manager</a>
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
                                        <Link to="/children">Kinder</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile">Profil</Link>
                                    </li>
                                    <li>
                                        <Link to="/appointment">Termine</Link>
                                    </li>
                                    <li>
                                        <Link to="/record">Ereignisse</Link>
                                    </li>
                                </div>
                            }

                            {showModeratorBoard || showAdminBoard ?
                                <div className="middle-action-panel">
                                    <li>
                                        <Link to="/employees">Mitarbeiter</Link>
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
                                    <Link to="/register">Registrierung</Link>
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

        </header>
    );
}
export default Navbar;