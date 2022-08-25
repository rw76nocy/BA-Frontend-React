import React, {useEffect, useState} from "react";
import '../style/login.component.css';

import AuthService from "../services/auth.service";
import Accounts from '../services/accounts.service';
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";

import {toast, ToastContainer} from "react-toastify";
import {formatErrorMessage, handleError} from "../utils/utils";

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
    const [errors, setErrors] = useState([]);
    const [roles, setRoles] = useState([]);

    const fetchEmployees = async (livingGroup) => {
        try {
            const response = await Employees.getEmployeesByLivingGroupWithoutAccount(livingGroup);
            const employees = response.data;
            setEmployees(employees);
            if (employees[0]) {
                setEmployee(employees.id);
            } else {
                setEmployee("");
            }
        } catch (error) {
            handleError(error);
        }
    }

    useEffect(async () => {
        setCurrentUser(AuthService.getCurrentUser());

        let admin = AuthService.getCurrentUser().roles.includes("ROLE_ADMIN");
        let mod = AuthService.getCurrentUser().roles.includes("ROLE_MODERATOR");
        let id = AuthService.getCurrentUser().id;

        if (admin) {
            try {
                const lgs = (await LivingGroups.getLivingGroups()).data;
                setLivingGroups(lgs);
                if (lgs[0]) {
                    setLivingGroup(lgs[0].name);
                    const emps = (await Employees.getEmployeesByLivingGroupWithoutAccount(lgs[0].name)).data;
                    setEmployees(emps);
                    if (emps[0]) {
                        setEmployee(emps[0].id);
                    } else {
                        setEmployee("");
                    }
                }
            } catch (error) {
                handleError(error);
            }
        }

        if (mod) {
            try {
                const account = (await Accounts.getAccountById(id)).data;
                const lgs = (await LivingGroups.getLivingGroup(account.person.livingGroup.name)).data;
                setLivingGroups(lgs);
                if (lgs[0]) {
                    setLivingGroup(lgs[0].name);
                    const emps = (await Employees.getEmployeesByLivingGroupWithoutAccount(lgs[0].name)).data;
                    setEmployees(emps);
                    if (emps[0]) {
                        setEmployee(emps[0].id);
                    } else {
                        setEmployee("");
                    }
                }
            } catch (error) {
                handleError(error);
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

    const onChangeRole = (e) => {
        setRole(e.target.value);
    }

    const onChangeLivingGroup = async (e) => {
        setLivingGroup(e.target.value);
        await fetchEmployees(e.target.value);
    }

    const onChangeEmployee = (e) => {
        setEmployee(e.target.value);
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

        if (livingGroup === "") {
            errors.push("Es muss eine Wohngruppe ausgewählt werden!");
        }

        if (employee === "") {
            errors.push("Es muss ein Mitarbeiter ausgewählt werden!");
        }

        if (username === "") {
            errors.push("Benutzername darf nicht leer sein!");
        }

        if (password === "") {
            errors.push("Passwort darf nicht leer sein!");
        }

        if (passwordConfirm === "") {
            errors.push("Passwort bestätigen darf nicht leer sein!");
        }

        if (password !== passwordConfirm) {
            errors.push("Passwort und Bestätigung stimmen nicht überein");
        }

        if (email === "") {
            errors.push("E-Mail-Adresse darf nicht leer sein!");
        }

        if (errors.length !== 0) {
            toast.error(formatErrorMessage(errors));
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

    const handleRegister = async (e) => {
        e.preventDefault();

        if (validate()) {
            roles.push(role);
            try {
                await AuthService.register(username, email, password, roles, employee);
                await fetchEmployees(livingGroup);
                clearInput();
                toast.success("Registrierung erfolgreich!");
            } catch (error) {
                handleError(error);
            }
        } else {
            toast.error("Es gibt ungültige Felder!");
        }
    }

    return (
        <div className="login-container">

            <div className="title">
                <h1><u>Registrierung</u></h1>
            </div>

            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
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
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="username"><b>Benutzername</b></label>
                    <input value={username} className="login-input" name="username" id="username" type="text" onChange={onChangeUsername}/>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="password"><b>Passwort</b></label>
                    <input value={password} className="login-input" name="password" id="password" type="password" onChange={onChangePassword}/>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="passwordConfirm"><b>Passwort bestätigen</b></label>
                    <input value={passwordConfirm} className="login-input" name="passwordConfirm" id="passwordConfirm" type="password" onChange={onChangePasswordConfirm}/>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                    <input  value={email} className="login-input" name="email" id="email" type="email" onChange={onChangeEmail}/>
                </span>
            </div>

            <div className="button-row">
                <button type="button" className="login-submit" onClick={handleRegister}>Registrieren</button>
            </div>

        </div>
    );
}
