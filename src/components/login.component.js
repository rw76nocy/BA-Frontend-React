import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import '../style/login.component.css';

import AuthService from "../services/auth.service";

export default function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [userInvalid, setUserInvalid] = useState("");
    const [passInvalid, setPassInvalid] = useState("");
    const navigate = useNavigate();

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        setMessage("Lädt");
        console.log('login started')

        if (validate()) {
            AuthService.login(username, password).then(
                () => {
                    navigate("/home");
                    window.location.reload();
                    console.log('login completed');
                },
                error => {
                    const resMessage = (
                        error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false);
                    setMessage(resMessage);
                });
        } else {
            setLoading(false);
            setMessage("Anmeldung ungültig");
            console.log('login invalid')
        }
    }

    const validate = () => {
        if (!username || !password) {
            if (!username) {
                setUserInvalid("Benutzername ungültig");
            } else {
                setUserInvalid("");
            }

            if (!password) {
                setPassInvalid("Passwort ungültig");
            } else {
                setPassInvalid("");
            }
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
                    <label className="label" htmlFor="username"><b>Benutzername</b></label>
                    <input className="input" name="username" id="username" type="text" onChange={onChangeUsername}/>
                    <span style={{ color: "red" }}>{userInvalid}</span>
                </span>
                <span className="login-row">
                    <label className="label" htmlFor="password"><b>Passwort</b></label>
                    <input className="input" name="password" id="password" type="password" onChange={onChangePassword}/>
                    <span style={{ color: "red" }}>{passInvalid}</span>
                </span>
            </div>

            <div className="button-row">
                <button type="button" className="submit" onClick={handleLogin}>Anmelden</button>
            </div>

            {message && (
                <div className="alert-row">
                    <div>
                        {message}
                    </div>
                </div>
            )}

        </div>
    );

}