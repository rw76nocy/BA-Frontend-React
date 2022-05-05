import React, {useEffect, useState} from "react";
import ImageInput from "./image.input.component";
import PersonalDataInput from "./personaldata.input.component";
import TextInput from "./text.input.component";
import GuardianInput from "./guardian.input.component";
import AsdInput from './asd.input.component';
import PersonInput from './person.input.component';
import ChildDoctorInput from "./childdoctor.input.component";
import DayCareInput from "./daycare.input.component";
import HealthInsuranceInput from "./healthinsurance.input.component";
import FoodSupplierInput from "./foodsupplier.input.component";
import InstitutionInput from "./institution.input.component";
import ReferencePerson from "./reference.person.input.component";
import Doctor from "./doctors.input.component";
import Therapist from "./therapists.input.component";
import Partner from "./partners.input.component";

import '../style/table.input.component.css';
import AuthService from "../services/auth.service";
import Accounts from "../services/accounts.service";
import LivingGroups from "../services/living.group.service";
import ChildrenService from "../services/children.service";
import FileService from "../services/file.service";

export default function Children() {

    const [disabled, setDisabled] = useState(false);

    const [image, setImage] = useState();
    const [personal, setPersonal] = useState({});
    const [reason, setReason] = useState("");
    const [guardian, setGuardian] = useState({});
    const [asd, setAsd] = useState({});
    const [mother, setMother] = useState({});
    const [father, setFather] = useState({});
    const [care, setCare] = useState("");
    const [visit, setVisit] = useState("");
    const [childdoctor, setChilddoctor] = useState({});
    const [daycare, setDaycare] = useState({});
    const [diseases, setDiseases] = useState("");
    const [livingGroup, setLivingGroup] = useState({});
    const [healthinsurance, setHealthinsurance] = useState({});
    const [foodsupplier, setFoodsupplier] = useState({});
    const [driver, setDriver] = useState({});
    const [referencePersons, setReferencePersons] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [partners, setPartners] = useState([]);

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [messageInvalid, setMessageInvalid] = useState("");

    useEffect(() => {
        let id = AuthService.getCurrentUser().id;

        Accounts.getAccountById(id).then(response => {
            LivingGroups.getLivingGroup(response.data.person.livingGroup.name).then(response => {
                if (response.data[0]) {
                    setLivingGroup(response.data[0]);
                }
            });
        });

    }, [])

    const getInputAsImage = (input) => {
        setImage(input);
    }

    const getInputAsPersonal = (input) => {
        setPersonal(input);
    }

    const getInputAsReason = (input) => {
        setReason(input);
    }

    const getInputAsGuardian = (input) => {
        setGuardian(input);
    }

    const getInputAsAsd = (input) => {
        setAsd(input);
    }

    const getInputAsMother = (input) => {
        setMother(input);
    }

    const getInputAsFather = (input) => {
        setFather(input);
    }

    const getInputAsCare = (input) => {
        setCare(input);
    }

    const getInputAsVisit = (input) => {
        setVisit(input);
    }

    const getInputAsChilddoctor = (input) => {
        setChilddoctor(input);
    }

    const getInputAsDaycare = (input) => {
        setDaycare(input);
    }

    const getInputAsDiseases = (input) => {
        setDiseases(input);
    }

    const getInputAsHealthinsurance = (input) => {
        setHealthinsurance(input);
    }

    const getInputAsFoodsupplier = (input) => {
        setFoodsupplier(input);
    }

    const getInputAsDriver = (input) => {
        setDriver(input);
    }

    const getInputAsReferencePersons = (input) => {
        setReferencePersons(input);
    }

    const getInputAsDoctors = (input) => {
        setDoctors(input);
    }

    const getInputAsTherapists = (input) => {
        setTherapists(input);
    }

    const getInputAsPartners = (input) => {
        setPartners(input);
    }

    const validate = () => {
        setErrors([]);

        if (personal.birthday === "") {
            errors.push("Geburtsdatum muss angegeben werden!");
        }

        if (personal.firstname === "") {
            errors.push("Vorname darf nicht leer sein!");
        }

        if (personal.lastname === "") {
            errors.push("Nachname darf nicht leer sein!");
        }

        if (personal.entrance === "") {
            errors.push("Aufnahmedatum muss angegeben werden!");
        }

        if (errors.length !== 0) {
            setMessageInvalid(JSON.stringify(errors));
            setMessage("");
            console.log("INPUT UNGÜLTIG!!!");
            return false;
        } else {
            setMessageInvalid("");
            console.log("INPUT GÜLTIG!!!");
            return true;
        }
    }

    const buildChildFromInput = () => {
        let child = {};
        child.livingGroup = livingGroup;
        child.gender = personal.gender;
        child.firstName = personal.firstname;
        child.lastName = personal.lastname;
        child.birthday = personal.birthday;
        child.entranceDate = personal.entrance;
        child.releaseDate = personal.release;
        child.reason = reason;
        child.care = care;
        child.visit = visit;
        child.diseases = diseases;
        child.superVisor1 = personal.supervisor1;
        child.superVisor2 = personal.supervisor2;

        child.guardian = guardian;
        child.asd = asd;
        child.mother = formatPerson(mother);
        child.father = formatPerson(father);
        child.childdoctor = childdoctor;
        child.dayCare = daycare;
        child.healthInsurance = healthinsurance;
        child.foodSupplier = foodsupplier;
        child.driver = driver;

        child.referencePersons = removeInternalId(referencePersons);
        child.doctors = removeInternalId(doctors);
        child.therapists = removeInternalId(therapists);
        child.partners = removeInternalId(partners);

        return child;
    }

    const formatPerson = (person) => {
        let format = {};
        if (person.firstname === undefined || person.lastname === undefined) {
            return format;
        }
        format.name = person.firstname + ' ' + person.lastname;
        format.address = person.address;
        format.phone = person.phone;
        format.fax = person.fax;
        format.birthday = person.birthday;
        format.email = person.email;
        return format;
    }

    const removeInternalId = (list) => {
        let temp = [];
        list.map(e => {
            if (e.internal_id) {
                let n = e;
                delete n.internal_id;
                temp.push(n);
            }
        });
        return temp;
    }

    const createChild = () => {
        if (validate()) {
            let child = buildChildFromInput();
            console.log(JSON.stringify(child));

            ChildrenService.addChild(child).then(
                response => {
                    let childId = response.data.childId;
                    console.log("ERFOLG:" + response.data.message);
                    console.log("ChildId:" + childId);
                    if (image !== undefined) {
                        let formData = new FormData();
                        formData.append('file', image);
                        formData.append('child_id', childId);

                        FileService.uploadFile(formData).then(response => {
                            console.log("ERFOLG FOTO:" + response.data.message);
                            window.location.reload();
                        });
                    } else {
                        window.location.reload();
                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log("FEHLER: " + resMessage);
                });
        }

        printData();
    }

    const printData = () => {
        console.log("CHILD-DATA IN CREATE-CHILDREN-PANEL");
        console.log("Living Group: "+JSON.stringify(livingGroup));
        console.log("Image: "+image);
        console.log("Personal Data: "+JSON.stringify(personal));
        console.log("Reason: "+JSON.stringify(reason));
        console.log("Guardian: "+JSON.stringify(guardian));
        console.log("Asd: "+JSON.stringify(asd));
        console.log("Mother: "+JSON.stringify(mother));
        console.log("Father: "+JSON.stringify(father));
        console.log("Care: "+JSON.stringify(care));
        console.log("Visit: "+JSON.stringify(visit));
        console.log("Childdoctor: "+JSON.stringify(childdoctor));
        console.log("Daycare: "+JSON.stringify(daycare));
        console.log("Diseases: "+JSON.stringify(diseases));
        console.log("Healthinsurance: "+JSON.stringify(healthinsurance));
        console.log("Foodsupplier: "+JSON.stringify(foodsupplier));
        console.log("Driver: "+JSON.stringify(driver));
        console.log("Reference Persons: "+JSON.stringify(referencePersons));
        console.log("Doctors: "+JSON.stringify(doctors));
        console.log("Therapists: "+JSON.stringify(therapists));
        console.log("Partners: "+JSON.stringify(partners));
    }

    return(
        <div className="children-container" aria-readonly={disabled}>
            <div className="children-components">
                <ImageInput title="Foto" callback={getInputAsImage}/>
                <PersonalDataInput title="Persönliche Daten" callback={getInputAsPersonal}/>
                <TextInput title="Grund der Aufnahme*" callback={getInputAsReason}/>
                <GuardianInput title="Vormund/Pfleger" callback={getInputAsGuardian}/>
                <AsdInput title="Allgemeiner sozialer Dienst" callback={getInputAsAsd}/>
                <PersonInput title="Mutter" callback={getInputAsMother}/>
                <PersonInput title="Vater" callback={getInputAsFather}/>
                <TextInput title="Regelung Sorgerecht" callback={getInputAsCare}/>
                <TextInput title="Besuch / Umgang / Kontakt" callback={getInputAsVisit}/>
                <ChildDoctorInput title="Kinderarzt" callback={getInputAsChilddoctor}/>
                <DayCareInput title="Kita / Tagespflege" callback={getInputAsDaycare}/>
                <TextInput title="Erkrankungen / Medikamente" callback={getInputAsDiseases}/>
                <HealthInsuranceInput title="Krankenkasse" callback={getInputAsHealthinsurance}/>
                <FoodSupplierInput title="Essensanbieter" callback={getInputAsFoodsupplier}/>
                <InstitutionInput title="Fahrdienst" callback={getInputAsDriver}/>
            </div>
            <div>
                <ReferencePerson callback={getInputAsReferencePersons}/>
                <Doctor callback={getInputAsDoctors}/>
                <Therapist callback={getInputAsTherapists}/>
                <Partner callback={getInputAsPartners}/>
            </div>
            <div>
                <button className="children-submit" onClick={createChild}>Kind anlegen</button>
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