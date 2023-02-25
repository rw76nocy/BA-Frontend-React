import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import '../style/login.component.css';

import AuthService from "../services/auth.service";
import {toast, ToastContainer} from "react-toastify";
import {toastError} from "../utils/utils";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }
        setLoading(true);

        if (validate()) {
            try {
                await AuthService.login(username, password);
                navigate("/home");
                window.location.reload();
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        } else {
            setLoading(false);
            toast.error("Anmeldedaten ungültig");
        }
    }

    const validate = () => {
        if (!username || !password) {
            return false;
        }

        if (username !== "" && password !== "") {
            return true;
        }
    }

    return (
        <div className="login-container">
            <div className="title">
                <h1><u>Anmeldung</u></h1>
            </div>

            <div className="login-panel">
                <span className="login-row">
                    <label className="login-label" htmlFor="username"><b>Benutzername</b></label>
                    <input className="login-input" name="username" id="username" type="text" onChange={onChangeUsername}/>
                </span>
                <span className="login-row">
                    <label className="login-label" htmlFor="password"><b>Passwort</b></label>
                    <input className="login-input" name="password" id="password" type="password" onChange={onChangePassword}/>
                </span>
            </div>

            <div className="button-row">
                <button type="button" className="login-submit" onClick={handleLogin}>Anmelden</button>
            </div>
        </div>
    );

}