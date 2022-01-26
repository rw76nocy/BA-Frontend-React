import React, {useEffect, useState} from "react";
import '../style/register.component.css';

import AuthService from "../services/auth.service";
import {useNavigate} from "react-router-dom";
import LivingGroups from "../services/living.group.service";

export default function Register() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("user");
    const [livingGroup, setLivingGroup] = useState("");
    const [livingGroups, setLivingGroups] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [userInvalid, setUserInvalid] = useState("");
    const [passInvalid, setPassInvalid] = useState("");
    const [passConfirmInvalid, setPassConfirmInvalid] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const fetchLivingGroups = () => {
        LivingGroups.getLivingGroups().then(response => {
            setLivingGroups(response.data);
            if (response.data[0]) {
                setLivingGroup(response.data[0].name);
            }
        });
    }

    useEffect(() => {
        setCurrentUser(AuthService.getCurrentUser());
        fetchLivingGroups();
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

    const validate = () => {

    }

    const handleLogin = (e) => {
        e.preventDefault();

        console.log(role);
        console.log(livingGroup);
        console.log(username);
        console.log(password);
        console.log(passwordConfirm);
    }

    return (
        <div className="register-container">

            <div className="title">
                <h1><u>Registrierung</u></h1>
            </div>

            <div className="register-panel">
                <span className="register-row">
                    <label className="register-label" htmlFor="role"><b>Rolle</b></label>
                    {showAdminBoard ?
                        <select onChange={onChangeRole} className="register-select" id="role" name="role">
                            <option value="mod">Teamleiter</option>
                            <option value="user">Mitarbeiter</option>
                        </select>
                        :
                        <select onChange={onChangeRole} className="register-select" id="role" name="role">
                            <option value="user">Mitarbeiter</option>
                        </select>
                    }
                </span>
                <span className="register-row">
                    <label className="register-label" htmlFor="livingGroup"><b>Wohngruppe</b></label>
                    {livingGroups.length > 0 ?
                        <select onChange={onChangeLivingGroup} className="register-select" id="livingGroup" name="livingGroup">
                            {livingGroups.map((lg) => (
                                <option key={lg.id} value={lg.name}>{lg.name}</option>
                            ))}
                        </select>
                        :
                        <select onChange={onChangeLivingGroup} className="register-select" id="livingGroup" name="livingGroup">
                            <option key="0" value="keine">keine</option>
                        </select>
                    }
                </span>
                <span className="register-row">
                    <label className="register-label" htmlFor="username"><b>Benutzername</b></label>
                    <input className="register-input" name="username" id="username" type="text" onChange={onChangeUsername}/>
                    <span style={{ color: "red" }}>{userInvalid}</span>
                </span>
                <span className="register-row">
                    <label className="register-label" htmlFor="password"><b>Passwort</b></label>
                    <input className="register-input" name="password" id="password" type="password" onChange={onChangePassword}/>
                    <span style={{ color: "red" }}>{passInvalid}</span>
                </span>
                <span className="register-row">
                    <label className="register-label" htmlFor="passwordConfirm"><b>Passwort bestätigen</b></label>
                    <input className="register-input" name="passwordConfirm" id="passwordConfirm" type="password" onChange={onChangePasswordConfirm}/>
                    <span style={{ color: "red" }}>{passConfirmInvalid}</span>
                </span>
            </div>

            <div className="button-row">
                <button type="button" className="register-submit" onClick={handleLogin}>Registrieren</button>
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


/*const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.username,
                this.state.email,
                this.state.password
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-dayCareGroup">
                                    <label htmlFor="username">Username</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required, vusername]}
                                    />
                                </div>

                                <div className="form-dayCareGroup">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[required, email]}
                                    />
                                </div>

                                <div className="form-dayCareGroup">
                                    <label htmlFor="password">Password</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required, vpassword]}
                                    />
                                </div>

                                <div className="form-dayCareGroup">
                                    <button className="btn btn-primary btn-block">Sign Up</button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-dayCareGroup">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}*/

/*<div className="login-container">

    <div className="title">
        <h1><u>Registrierung</u></h1>
    </div>

    <div className="login-panel">
                    <span className="login-row">
                        <label htmlFor="role"><b>Rolle</b></label>
                            <select className="role" name="role" id="role">
                                <option value="admin">Administrator</option>
                                <option value="employee">Mitarbeiter</option>
                            </select>
                    </span>
        <span className="login-row">
                        <label htmlFor="username"><b>Benutzername</b></label>
                        <input className="input" name="username" id="username" type="text"/>
                    </span>
        <span className="login-row">
                        <label htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input className="input" name="email" id="email" type="email"/>
                    </span>
        <span className="login-row">
                        <label htmlFor="password"><b>Passwort</b></label>
                        <input className="input" name="password" id="password" type="password"/>
                    </span>
        <span className="login-row">
                        <label htmlFor="password2"><b>Passwort bestätigen</b></label>
                        <input className="input" name="password2" id="password2" type="password"/>
                    </span>
    </div>

    <div className="button-row">
        <button type="button" className="submit">Registrieren</button>
    </div>

    <div className="change-panel">
                    <span className="change-row">
                          <p id="loginText">Sie haben bereits einen Account?</p>
                          <p><button type="button" className="submit" onClick={changeForm}>Anmeldung</button></p>
                    </span>
    </div>

</div>*/
