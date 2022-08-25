import React, {useEffect, useState} from 'react';
import {Link, Route, Routes, useNavigate} from "react-router-dom";

import "../style/navigation-bar.component.css";

import {RequireAuth} from "../utils/private_route";
import ChildNav from './children.navigation.component';
import Children from "./children.create.component";
import Child from "./child.show.component";

import AuthService from "../services/auth.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import ChildrenService from "../services/children.service";
import {toast, ToastContainer} from "react-toastify";
import {handleError} from "../utils/utils";

function Navbar() {
    const [livingGroup, setLivingGroup] = useState("");
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [childNav, setChildNav] = useState(false);
    const [showChildNav, setShowChildNav] = useState(false);
    const [children, setChildren] = useState([]);
    const navigate = useNavigate();

    useEffect(async () => {
        setCurrentUser(AuthService.getCurrentUser());
        if (AuthService.getCurrentUser()) {
            let user = AuthService.getCurrentUser().roles.includes("ROLE_USER");
            let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
            let id = AuthService.getCurrentUser().id;
            if (user || mod) {
                try {
                    const account = (await Accounts.getAccountById(id)).data;
                    const lg = (await LivingGroups.getLivingGroup(account.person.livingGroup.name)).data;
                    setLivingGroup(lg[0].name);
                    const childs = (await ChildrenService.getChildrenByLivingGroup(lg[0].name)).data;
                    setChildren(childs);
                } catch (error) {
                    handleError(error);
                }
            }
        }
    }, [])

    useEffect(() => {
        // on component update: refresh roles if user exist
        if (currentUser) {
            let roles = [];
            roles = currentUser.roles;
            if (roles) {
                setShowModeratorBoard(roles.includes("ROLE_MODERATOR"));
                setShowAdminBoard(roles.includes("ROLE_ADMIN"));
            }
        } else {
            setShowModeratorBoard(false);
            setShowAdminBoard(false);
        }
    }, [currentUser])

    useEffect(() => {
        if (AuthService.getCurrentUser()) {
            setShowChildNav(childNav);
        } else {
            setShowChildNav(false);
        }
    }, [childNav])

    const logout = () => {
        deactivateChildNav()
        //clear user from local storage
        AuthService.logout();
        setCurrentUser(undefined);
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        toast.success("Abmeldung erfolgreich!");
    }

    const changeChildNav = () => {
        const user = AuthService.getCurrentUser();
        if (user !== null) {
            if (childNav) {
                setChildNav(false);
            } else {
                setChildNav(true);
            }
        } else {
            navigate('./login');
            logout();
        }
    }

    const deactivateChildNav = () => {
        setChildNav(false);
    }

    return (
        <header className="header">

            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
            </div>

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
                        {currentUser &&
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

                                {showModeratorBoard &&
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/options" onClick={deactivateChildNav}>Einstellungen</Link>
                                        </li>
                                    </div>
                                }

                                {(showModeratorBoard || showAdminBoard) &&
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/employees" onClick={deactivateChildNav}>Mitarbeiter</Link>
                                        </li>
                                    </div>
                                }

                                {(showModeratorBoard || showAdminBoard) &&
                                    <div className="middle-action-panel">
                                        <li>
                                            <Link to="/accounts" onClick={deactivateChildNav}>Konten</Link>
                                        </li>
                                    </div>
                                }
                            </div>
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
                {showChildNav  &&
                    <div>
                        <ChildNav/>
                        <div>
                            <Routes>
                                {children.map((c) => (
                                    <Route key={c.id} path={"/child/" + c.id} element={
                                        <RequireAuth navigateTo="./login">
                                            <Child child={c}/>
                                        </RequireAuth>
                                    }/>
                                ))}
                                <Route path="/create" element={
                                    <RequireAuth navigateTo="../login" isCreate={true}>
                                        <Children/>
                                    </RequireAuth>
                                } />
                            </Routes>
                        </div>
                    </div>
                }
            </div>

        </header>
    );
}
export default Navbar;