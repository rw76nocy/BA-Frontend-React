import React, {useEffect, useState} from "react";
import ImageInput from "./image.input.component";
import PersonalDataInput from "./personaldata.input.component";
import TextInput from "./text.input.component";
import GuardianInput from "./guardian.input.component";

import '../style/table.input.component.css';

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
                {/*//TODO Hier dann weiter machen!!!*/}
                <GuardianInput title="Vormund/Pfleger" data={child} disabled={disabled}/>
                {/*<ImageInput title="Foto" callback={getInputAsImage}/>
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
                <InstitutionInput title="Fahrdienst" callback={getInputAsDriver}/>*/}
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