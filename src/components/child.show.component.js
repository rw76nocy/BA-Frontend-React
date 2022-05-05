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

export default function Child({child}) {

    const [disabled, setDisabled] = useState(true);

    const edit = () => {
        setDisabled(!disabled);
    }

    return(
        <div className="children-container">
            <div className="table-input-toggle-row">
                <button className="table-input-toggle-button" type="button" onClick={edit}>Bearbeiten</button>
                <button className="table-input-toggle-button" type="button">Entfernen</button>
            </div>
            <div className="children-components">
                <ImageInput title="Foto" childId={child.id} disabled={disabled}/>
                <PersonalDataInput title="Persönliche Daten" data={child} disabled={disabled}/>
                <TextInput title="Grund der Aufnahme" data={child.reason} disabled={disabled}/>
                <GuardianInput title="Vormund/Pfleger" data={child} disabled={disabled}/>
                <AsdInput title="Allgemeiner sozialer Dienst" data={child} disabled={disabled}/>
                <PersonInput title="Mutter" data={child} disabled={disabled}/>
                <PersonInput title="Vater" data={child} disabled={disabled}/>
                <TextInput title="Regelung Sorgerecht" data={child.care} disabled={disabled}/>
                <TextInput title="Besuch / Umgang / Kontakt" data={child.visit} disabled={disabled}/>
                <ChildDoctorInput title="Kinderarzt" data={child} disabled={disabled}/>
                <TextInput title="Erkrankungen / Medikamente" data={child.diseases} disabled={disabled}/>
                <DayCareInput title="Kita / Tagespflege" data={child} disabled={disabled}/>
                <HealthInsuranceInput title="Krankenkasse" data={child} disabled={disabled}/>
                <FoodSupplierInput title="Essensanbieter" data={child} disabled={disabled}/>
                <InstitutionInput title="Fahrdienst" data={child} disabled={disabled}/>
            </div>
            {/*<div>
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
            </div>*/}

        </div>
    );
}