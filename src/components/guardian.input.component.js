import React, {useEffect, useState} from "react";

import '../style/input.component.css';
import AuthService from "../services/auth.service";
import Accounts from "../services/accounts.service";
import LivingGroups from "../services/living.group.service";
import Employees from "../services/employees.service";
import Persons from "../services/person.service";

export default function GuardianInput({title, callback}) {

    /*const [employees, setEmployees] = useState([]);*/
    const [guardians, setGuardians] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        /*let id = AuthService.getCurrentUser().id;

        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    Employees.getAllEmployeesByLivingGroup(response.data[0].name).then(response => {
                        let emps = [{ id: 0, name: "keine"}];
                        response.data.map(emp => {
                            emps.push(emp);
                        })
                        setEmployees(emps);
                    });
                }
            });
        });*/

        Persons.getAllGuardians().then(response => {
            if (response.data) {
                let guards = [{ id: 0, name: "keine"}];
                response.data.map(guard => {
                    guards.push(guard);
                })
                console.log(JSON.stringify(guards));
                setGuardians(guards);
            }
        });

    }, [])

    const onExistingChange = (e) => {
        let id = e.target.value;

        Employees.getEmployeesById(id).then(response => {
            if (response.data) {
                setId(response.data.id);
                setName(response.data.name);
                setPhone(response.data.phone);
                setFax(response.data.fax);
                setEmail(response.data.email);
                sendInputToParent(response.data.id,response.data.name,response.data.phone,response.data.fax,response.data.email);
            } else {
                setId("0");
                setName("");
                setPhone("");
                setFax("");
                setEmail("");
                sendEmptyInputToParent();
            }
        });
    }

    const onNameChange = (e) => {
        setName(e.target.value);
        sendInputToParent(id,e.target.value,phone,fax,email);
    }

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
        sendInputToParent(id,name,e.target.value,fax,email);
    }

    const onFaxChange = (e) => {
        setFax(e.target.value);
        sendInputToParent(id,name,phone,e.target.value,email);
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        sendInputToParent(id,name,phone,fax,e.target.value);
    }

    const sendInputToParent = (id,name,phone,fax,email) => {
        let guard = {};
        guard.id = id;
        guard.name = name;
        guard.phone = phone;
        guard.fax = fax;
        guard.email = email;
        callback(guard);
    }

    const sendEmptyInputToParent = () => {
        let guard = {};
        callback(guard);
    }

    return(
        <div className="input-border">

            <div className="input-container">
                <h3><u>{title}</u></h3>

                <div className="input-create-container">

                    <span className="input-row">
                        <label className="input-label" htmlFor="existing"><b>Vorhandene auswählen</b></label>
                        <select onChange={onExistingChange} className="input-select" id="existing" name="existing">
                            {/*{employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}*/}
                            {guardians.map((guard) => (
                                <option key={guard.id} value={guard.id}>{guard.name}</option>
                            ))}
                        </select>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="name"><b>Name*</b></label>
                        <input onChange={onNameChange} className="input-input" value={name} name="name" id="name" type="text" placeholder="Name"/>
                    </span>

                    <span className="input-sub-row">
                        <div className="input-half-row-first">
                            <label className="input-label" htmlFor="phone"><b>Telefon*</b></label>
                            <input onChange={onPhoneChange} className="input-input" value={phone} name="phone" id="phone" type="text" placeholder="Telefon-Nummer"/>
                        </div>
                        <div className="input-half-row-second">
                            <label className="input-label" htmlFor="phone"><b>Fax</b></label>
                            <input onChange={onFaxChange} className="input-input" value={fax} name="fax" id="fax" type="text" placeholder="Fax-Nummer"/>
                        </div>
                    </span>

                    <span className="input-row">
                        <label className="input-label" htmlFor="email"><b>E-Mail-Adresse</b></label>
                        <input onChange={onEmailChange} className="input-input" value={email} name="email" id="email" type="text" placeholder="E-Mail-Adresse"/>
                    </span>

                </div>

            </div>


        </div>
    );
}