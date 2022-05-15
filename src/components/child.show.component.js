import React, {useEffect, useState} from "react";
import ImageInput from "./image.input.component";
import PersonalDataInput from "./personaldata.input.component";
import TextInput from "./text.input.component";
import GuardianInput from "./guardian.input.component";
import AsdInput from "./asd.input.component";
import PersonInput from "./person.input.component";
import ChildDoctorInput from "./childdoctor.input.component";
import DayCareInput from "./daycare.input.component";
import HealthInsuranceInput from "./healthinsurance.input.component";
import '../style/table.input.component.css';
import FoodSupplierInput from "./foodsupplier.input.component";
import InstitutionInput from "./institution.input.component";
import ReferencePerson from "./reference.person.input.component";
import Doctor from "./doctors.input.component";
import Therapist from "./therapists.input.component";
import Partner from "./partners.input.component";

import ChildrenService from "../services/children.service";
import FileService from "../services/file.service";

export default function Child({child}) {

    const [disabled, setDisabled] = useState(true);

    const [id, setId] = useState("");
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
        console.log("Actual child: " + JSON.stringify(child));
        setId(child.id);
        setLivingGroup(child.livingGroup);
    }, [child])

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
        child.id = id;
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

        child.referencePersons = referencePersons;
        child.doctors = doctors;
        child.therapists = therapists;
        child.partners = partners;

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

    const edit = () => {
        setDisabled(!disabled);
    }

    const clear = () => {
        ChildrenService.deleteChild(child.id).then(
            response => {
                console.log("ERFOLG:" + response.data.message);
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log("FEHLER: " + resMessage);
            }
        );
    }

    const update = () => {
        let child = buildChildFromInput();
        console.log(JSON.stringify(child));

        if (validate()) {
            ChildrenService.updateChild(child).then(
                response => {
                    let childId = response.data.childId;
                    console.log("ERFOLG:" + response.data.message);
                    console.log("ChildId:" + childId);
                    if (image !== undefined) {
                        let formData = new FormData();
                        formData.append('file', image);
                        formData.append('child_id', childId);

                        FileService.updateFile(formData).then(response => {
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
    }

    return(
        <div className="children-container" aria-readonly={disabled}>
            {disabled ?
                <div className="table-input-toggle-row">
                    <button className="table-input-toggle-button" type="button" onClick={edit}>Bearbeiten</button>
                    <button className="table-input-toggle-button" type="button" onClick={clear}>Entfernen</button>
                </div>
                :
                <div>
                    <div className="table-input-toggle-row">
                        <button className="table-input-toggle-button" type="button" onClick={edit}>Zurücksetzen</button>
                        <button className="table-input-toggle-button" type="button" onClick={update}>Änderung speichern</button>
                    </div>
                    <div>
                        <span style={{color: "red", width: "100%"}}>{messageInvalid}</span>
                    </div>
                    <div>
                        <span style={{color: "green", width: "100%"}}>{message}</span>
                    </div>
                </div>
            }

            <div className="children-components">
                <ImageInput title="Foto" callback={getInputAsImage} childId={child.id} disabled={disabled}/>
                <PersonalDataInput title="Persönliche Daten" callback={getInputAsPersonal} data={child} disabled={disabled}/>
                <TextInput title="Grund der Aufnahme" callback={getInputAsReason} data={child.reason} disabled={disabled}/>
                <GuardianInput title="Vormund/Pfleger" callback={getInputAsGuardian} data={child} disabled={disabled}/>
                <AsdInput title="Allgemeiner sozialer Dienst" callback={getInputAsAsd} data={child} disabled={disabled}/>
                <PersonInput title="Mutter" callback={getInputAsMother} data={child} disabled={disabled}/>
                <PersonInput title="Vater" callback={getInputAsFather} data={child} disabled={disabled}/>
                <TextInput title="Regelung Sorgerecht" callback={getInputAsCare} data={child.care} disabled={disabled}/>
                <TextInput title="Besuch / Umgang / Kontakt" callback={getInputAsVisit} data={child.visit} disabled={disabled}/>
                <ChildDoctorInput title="Kinderarzt" callback={getInputAsChilddoctor} data={child} disabled={disabled}/>
                <DayCareInput title="Kita / Tagespflege" callback={getInputAsDaycare} data={child} disabled={disabled}/>
                <TextInput title="Erkrankungen / Medikamente" callback={getInputAsDiseases} data={child.diseases} disabled={disabled}/>
                <HealthInsuranceInput title="Krankenkasse" callback={getInputAsHealthinsurance} data={child} disabled={disabled}/>
                <FoodSupplierInput title="Essensanbieter" callback={getInputAsFoodsupplier} data={child} disabled={disabled}/>
                <InstitutionInput title="Fahrdienst" callback={getInputAsDriver} data={child} disabled={disabled}/>
            </div>
            <div>
                <ReferencePerson callback={getInputAsReferencePersons} data={child} disabled={disabled}/>
                <Doctor callback={getInputAsDoctors} data={child} disabled={disabled}/>
                <Therapist callback={getInputAsTherapists} data={child} disabled={disabled}/>
                <Partner callback={getInputAsPartners} data={child} disabled={disabled}/>
            </div>
        </div>
    );
}