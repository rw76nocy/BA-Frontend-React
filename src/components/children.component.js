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

    const [guardian, setGuardian] = useState({});

    const getInputAsGuardian = (input) => {
        setGuardian(input);
    }

    const printData = () => {
        console.log(JSON.stringify(guardian));
    }

    return(
        <div className="children-container">
            <div className="children-components">
                <ImageInput title="Foto"/>
                <PersonalDataInput title="Persönliche Daten"/>
                <TextInput title="Grund der Aufnahme"/>
                <GuardianInput title="Vormund/Pfleger" callback={getInputAsGuardian}/>
                <AsdInput title="Allgemeiner sozialer Dienst"/>
                <PersonInput title="Mutter"/>
                <PersonInput title="Vater"/>
                <TextInput title="Regelung Sorgerecht"/>
                <TextInput title="Besuch / Umgang / Kontakt"/>
                <ChildDoctorInput title="Kinderarzt"/>
                <DayCareInput title="Kita"/>
                <TextInput title="Erkrankungen / Medikamente"/>
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