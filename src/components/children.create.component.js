import React, {useState} from "react";
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

export default function Children() {

    const [image, setImage] = useState("");
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
    const [healthinsurance, setHealthinsurance] = useState({});
    const [foodsupplier, setFoodsupplier] = useState({});
    const [driver, setDriver] = useState({});
    const [referencePersons, setReferencePersons] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [partners, setPartners] = useState([]);

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

    const printData = () => {
        console.log("CHILD-DATA IN CREATE-CHILDREN-PANEL");
        console.log("Image: "+JSON.stringify(image));
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
        <div className="children-container">
            <div className="children-components">
                <ImageInput title="Foto" callback={getInputAsImage}/>
                <PersonalDataInput title="Persönliche Daten" callback={getInputAsPersonal}/>
                <TextInput title="Grund der Aufnahme" callback={getInputAsReason}/>
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
                <button className="children-submit" onClick={printData}>Kind anlegen</button>
            </div>

        </div>
    );
}