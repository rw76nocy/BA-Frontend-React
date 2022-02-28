import React, {useEffect, useState} from "react";
import '../style/login.component.css';

import AuthService from "../services/auth.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";

export default function Register() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [role, setRole] = useState("user");
    const [livingGroup, setLivingGroup] = useState("");
    const [livingGroups, setLivingGroups] = useState([]);
    const [employee, setEmployee] = useState("");
    const [employees, setEmployees] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");
    const [livingGroupInvalid, setLivingGroupInvalid] = useState("");
    const [employeeInvalid, setEmployeeInvalid] = useState("");
    const [userInvalid, setUserInvalid] = useState("");
    const [passInvalid, setPassInvalid] = useState("");
    const [passConfirmInvalid, setPassConfirmInvalid] = useState("");
    const [emailInvalid, setEmailInvalid] = useState("");
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");
    const [errors, setErrors] = useState([]);
    const [roles, setRoles] = useState([]);

    const fetchEmployees = (livingGroup) => {
        Employees.getEmployeesByLivingGroupWithoutAccount(livingGroup).then(response => {
            setEmployees(response.data);
            if (response.data[0]) {
                setEmployee(response.data[0].id);
            } else {
                setEmployee("");
            }
        });
    }

    useEffect(() => {
        setCurrentUser(AuthService.getCurrentUser());

        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (admin) {
            LivingGroups.getLivingGroups().then(response => {
                setLivingGroups(response.data);
                if (response.data[0]) {
                    setLivingGroup(response.data[0].name);
                    Employees.getEmployeesByLivingGroupWithoutAccount(response.data[0].name).then(response => {
                        setEmployees(response.data);
                        if (response.data[0]) {
                            setEmployee(response.data[0].id);
                        } else {
                            setEmployee("");
                        }
                    });
                }
            });
        }

        if (mod) {
            Accounts.getAccountById(id).then(response => {
                LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                    setLivingGroups(response.data);
                    if (response.data[0]) {
                        setLivingGroup(response.data[0].name);
                        Employees.getEmployeesByLivingGroupWithoutAccount(response.data[0].name).then(response => {
                            setEmployees(response.data);
                            if (response.data[0]) {
                                setEmployee(response.data[0].id);
                            } else {
                                setEmployee("");
                            }
                        });
                    }
                });
            });
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

    const onChangeRole = (e) => {
        setRole(e.target.value);
    }

    const onChangeLivingGroup = (e) => {
        setLivingGroup(e.target.value);
        fetchEmployees(e.target.value);
        console.log(e.target.value);
    }

    const onChangeEmployee = (e) => {
        setEmployee(e.target.value);
        console.log(e.target.value);
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const validate = () => {
        setErrors([]);
        setRoles([]);
        setMessage("");
        setMessageInvalid("");
        setLivingGroupInvalid("");
        setEmployeeInvalid("");
        setUserInvalid("");
        setPassInvalid("");
        setPassConfirmInvalid("");
        setEmailInvalid("");

        if (errors.length === 0) {
            console.log("Error Array ist hier noch leer");
        }

        if (livingGroup === "") {
            errors.push("Es muss eine Wohngruppe ausgewählt werden!");
            setLivingGroupInvalid("Es muss eine Wohngruppe ausgewählt werden!");
        }

        if (employee === "") {
            errors.push("Es muss ein Mitarbeiter ausgewählt werden!");
            setEmployeeInvalid("Es muss ein Mitarbeiter ausgewählt werden!");
        }

        if (username === "") {
            errors.push("Benutzername darf nicht leer sein!");
            setUserInvalid("Benutzername darf nicht leer sein!");
        }

        if (password === "") {
            errors.push("Passwort darf nicht leer sein!");
            setPassInvalid("Passwort darf nicht leer sein!");
        }

        if (passwordConfirm === "") {
            errors.push("Passwort bestätigen darf nicht leer sein!");
            setPassConfirmInvalid("Passwort bestätigen darf nicht leer sein!");
        }

        if (password !== passwordConfirm) {
            errors.push("Passwort und Bestätigung stimmen nicht überein");
            setPassConfirmInvalid("Passwort und Bestätigung stimmen nicht überein");
        }

        if (email === "") {
            errors.push("E-Mail-Adresse darf nicht leer sein!");
            setEmailInvalid("E-Mail-Adresse darf nicht leer sein!");
        }

        if (errors.length !== 0) {
            return false;
        }

        return true;
    }

    const clearInput = () => {
        setUsername("");
        setPassword("");
        setPasswordConfirm("");
        setEmail("");
    }

    const handleRegister = (e) => {
        e.preventDefault();

        if (validate()) {
            console.log("Alle Eingabefelder sind gültig!");

            console.log(role);
            console.log(livingGroup);
            console.log(employee);
            console.log(username);
            console.log(password);
            console.log(passwordConfirm);
            console.log(email);

            roles.push(role);

            AuthService.register(username, email, password, roles, employee).then(
                response => {
                    setMessage(response.data.message);
                    setMessageInvalid("");
                    fetchEmployees(livingGroup);
                    clearInput();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessageInvalid(resMessage);
                    setMessage("");
                });
        } else {
            console.log("Es gibt ungültige Felder!");
        }
    }

    return (
        <div className="login-container">

            <div className="title">
                <h1><u>Registrierung</u></h1>
            </div>

            <div className="login-panel">
                <span className="login-row">
                    <label className="login-label" htmlFor="role"><b>Rolle</b></label>
                    {showAdminBoard ?
                        <select value={role} onChange={onChangeRole} className="login-select" id="role" name="role">
                            <option value="mod">Teamleiter</option>
                            <option value="user">Mitarbeiter</option>
                        </select>
                        :
                        <select value={role} onChange={onChangeRole} className="login-select" id="role" name="role">
                            <option value="user">Mitarbeiter</option>
                        </select>
                    }
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="livingGroup"><b>Wohngruppe</b></label>
                    {livingGroups.length > 0 ?
                        <select onChange={onChangeLivingGroup} className="login-select" id="livingGroup" name="livingGroup">
                            {livingGroups.map((lg) => (
                                <option key={lg.id} value={lg.name}>{lg.name}</option>
                            ))}
                        </select>
                        :
                        <select onChange={onChangeLivingGroup} className="login-select" id="livingGroup" name="livingGroup">
                            <option key="0" value="keine">keine</option>
                        </select>
                    }
                    <span style={{ color: "red" }}>{livingGroupInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="employee"><b>Mitarbeiter</b></label>
                    {employees.length > 0 ?
                        <select onChange={onChangeEmployee} className="login-select" id="employee" name="employee">
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        :
                        <select onChange={onChangeEmployee} className="login-select" id="employee" name="employee">
                            <option key="0" value="keine">keine</option>
                        </select>
                    }
                    <span style={{ color: "red" }}>{employeeInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="username"><b>Benutzername</b></label>
                    <input value={username} className="login-input" name="username" id="username" type="text" onChange={onChangeUsername}/>
                    <span style={{ color: "red" }}>{userInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="password"><b>Passwort</b></label>
                    <input value={password} className="login-input" name="password" id="password" type="password" onChange={onChangePassword}/>
                    <span style={{ color: "red" }}>{passInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="passwordConfirm"><b>Passwort bestätigen</b></label>
                    <input value={passwordConfirm} className="login-input" name="passwordConfirm" id="passwordConfirm" type="password" onChange={onChangePasswordConfirm}/>
                    <span style={{ color: "red" }}>{passConfirmInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                    <input  value={email} className="login-input" name="email" id="email" type="email" onChange={onChangeEmail}/>
                    <span style={{ color: "red" }}>{emailInvalid}</span>
                </span>
            </div>

            <div className="button-row">
                <button type="button" className="login-submit" onClick={handleRegister}>Registrieren</button>
            </div>

            <div>
                <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
            </div>
            <div>
                <span style={{color: "green", width: "100%"}}>{message}</span>
            </div>

        </div>
    );
}
