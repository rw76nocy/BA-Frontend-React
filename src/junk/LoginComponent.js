import React, { ReactElement, Fragment, useState } from "react";
import './LoginRegisterStyle.css'


class LoginComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            login : false,
        };

        this.setLogin = this.setLogin.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        event.preventDefault();
        const target = event.target;
        this.setState({
            [target.name]: target.value,
        });
    }

    handleSubmit(event) {
        /*event.preventDefault();
        Userfront.login({
            method: "password",
            emailOrUsername: this.state.emailOrUsername,
            password: this.state.password,
        });*/
    }

    setLogin(b) {
        this.setState( { login : b});
    }

    componentDidMount() {
        document.body.style.backgroundColor = "chocolate"
    }

    render() {
        return (
            <Fragment>
                <div className="login-container">

                    <div className="title">
                        <h1><u>Willkommen im WG-Manager</u></h1>
                    </div>

                    {this.state.login ?
                        <div>
                            <div className="login-panel">
                                <span className="login-row">
                                    <label htmlFor="username"><b>Benutzername</b></label><input name="username" id="username" type="text"/>
                                </span>
                                <span className="login-row">
                                    <label htmlFor="password"><b>Passwort</b></label><input name="password" id="password" type="password"/>
                                </span>
                            </div>
                            <div className="button-row">
                                <button type="button" className="submit">Anmelden</button>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="login-panel">
                                <span className="login-row">
                                    <label htmlFor="role"><b>Rolle</b></label>
                                    <select className="role" name="role" id="role">
                                        <option value="admin">Administrator</option>
                                        <option value="employee">Mitarbeiter</option>
                                    </select>
                                </span>
                                <span className="login-row">
                                    <label htmlFor="username"><b>Benutzername</b></label><input name="username" id="username" type="text"/>
                                </span>
                                <span className="login-row">
                                    <label htmlFor="email"><b>E-Mail-Adresse</b></label><input name="email" id="email" type="email"/>
                                </span>
                                <span className="login-row">
                                    <label htmlFor="password"><b>Passwort</b></label><input name="password" id="password" type="password"/>
                                </span>
                                <span className="login-row">
                                    <label htmlFor="password2"><b>Passwort bestätigen</b></label><input name="password2" id="password2" type="password"/>
                                </span>
                            </div>
                            <div className="button-row">
                                <button type="button" className="submit">Registrieren</button>
                            </div>
                        </div>
                    }

                    <div className="change-panel">
                        {this.state.login ?
                            <span className="change-row">
                                <p id="loginText">Sie haben noch keinen Account?</p>
                                <p><button type="button" className="submit" onClick={() => this.setLogin(false)}>Registrierung</button></p>
                            </span>
                            :
                            <span className="change-row">
                                <p id="loginText">Sie haben bereits einen Account?</p>
                                <p><button type="button" className="submit" onClick={() => this.setLogin(true)}>Anmeldung</button></p>
                            </span>
                        }
                    </div>

                </div>
            </Fragment>
        );
    }
}

export default LoginComponent