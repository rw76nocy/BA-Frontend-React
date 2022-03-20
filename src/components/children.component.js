import React, {useState} from "react";
import ChildNav from './children.navigation.component';
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

import '../style/children.component.css';

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
    const [diseases, setDiseases] = useState("");

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

    const getInputAsDiseases = (input) => {
        setDiseases(input);
    }

    const printData = () => {
        console.log("Image: "+JSON.stringify(image));
        console.log("Personal Data: "+JSON.stringify(personal));
        console.log("Reason: "+JSON.stringify(reason));
        console.log("Guardian: "+JSON.stringify(guardian));
        console.log("Asd: "+JSON.stringify(asd));
        console.log("Mother: "+JSON.stringify(mother));
        console.log("Father: "+JSON.stringify(father));
        console.log("Care: "+JSON.stringify(care));
        console.log("Visit: "+JSON.stringify(visit));
        console.log("Diseases: "+JSON.stringify(diseases));
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
                <ChildDoctorInput title="Kinderarzt"/>
                <DayCareInput title="Kita"/>
                <TextInput title="Erkrankungen / Medikamente" callback={getInputAsDiseases}/>
                <HealthInsuranceInput title="Krankenkasse"/>
                <FoodSupplierInput title="Essensanbieter"/>
                <InstitutionInput title="Fahrdienst"/>
            </div>
            <div>
                <button className="input-input" onClick={printData}>Anlegen</button>
            </div>

        </div>
    );
}