import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import '../style/input.component.css';
import '../style/table.input.component.css';
import {isJsonEmpty} from "../utils/utils";

export default function ListView({data, title, callback}) {

    const [participantId, setParticipantId] = useState(1);
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [selectedPartiIndex, setSelectedPartiIndex] = useState(1);
    const [isChildrenListView, setIsChildrenListView] = useState(false);

    useEffect(() => {
        setSelectedParticipants([]);
        if (title === "Kinder") {
            setIsChildrenListView(true);
        } else {
            setIsChildrenListView(false);
        }

        if (data[0]) {
            setParticipantId(data[0].id);
            setParticipants(data);
        }
    }, [data])

    const onChangeParticipant = (e) => {
        setParticipantId(Number(e.target.value));
    }

    const addParticipant = () => {
        let arr = [...selectedParticipants];
        let parti = {};
        let id = participantId;
        if (participants.length === 1) {
            setParticipantId(participants[0].id);
            id = participants[0].id;
        }
        if (participants.length > 0 && id === 0) {
            setParticipantId(participants[0].id);
            id = participants[0].id;
        }
        if (selectedParticipants.length === 0 && id === 0) {
            setParticipantId(participants[0].id);
            id = participants[0].id;
        }
        //looking for participant in drop down
        participants.map((part => {
            if (part.id === id) {
                parti = part;
            }
        }))

        if (isJsonEmpty(parti)) {
            return;
        }

        arr.push(parti);
        arr.sort((a,b) => a.id - b.id);

        setSelectedParticipants(arr);
        sendInputToParent(arr);

        //select first item on first add
        if (arr.length === 1) {
            setSelectedPartiIndex(arr[0].id);
        }

        //delete participant from dropdown and set data
        let filtered = participants.filter(part => part.id !== id);
        setParticipants(filtered);

        //select first element of filtered list, if exist, else select 0;
        if (filtered[0]) {
            setParticipantId(filtered[0].id);
        } else {
            setParticipantId(0);
        }
    }

    const removeParticipant = () => {
        let arr = [...participants];
        let parti = {};
        //looking for participant in drop down
        selectedParticipants.map((part => {
            if (part.id === selectedPartiIndex) {
                parti = part;
            }
        }))

        if (isJsonEmpty(parti)) {
            return;
        }

        arr.push(parti);
        arr.sort((a,b) => a.id - b.id);

        setParticipants(arr);

        //delete participant from dropdown and set data
        let filtered = selectedParticipants.filter(part => part.id !== selectedPartiIndex);
        setSelectedParticipants(filtered);

        sendInputToParent(filtered);

        //select first element of filtered list, if exist, else select 0;
        if (filtered[0]) {
            setSelectedPartiIndex(filtered[0].id);
        } else {
            setSelectedPartiIndex(0);
        }
    }

    const handlePartiItemClick = (event, index) => {
        setSelectedPartiIndex(index);
    };

    const sendInputToParent = (input) => {
        callback(input);
    }

    return(
        <div>

            <span className="input-sub-row">
                <label className="input-label" htmlFor="participants"><b>{title}</b></label>
                <div className="appointment-half-row-first">
                    {isChildrenListView ?
                        <select onChange={onChangeParticipant} className="input-select" value={participantId} name="participants" id="participants">
                            {participants.map((part) => (
                                <option key={part.id} value={part.id}>{part.firstName + ' ' + part.lastName}</option>
                            ))}
                        </select>
                        :
                        <select onChange={onChangeParticipant} className="input-select" value={participantId} name="participants" id="participants">
                            {participants.map((part) => (
                                <option key={part.id} value={part.id}>{part.name}</option>
                            ))}
                        </select>
                    }
                </div>
                <div className="appointment-half-row-second">
                    <div className="table-input-toggle-row">
                        <button onClick={addParticipant} className="appointment-add-button" type="button"><b>+</b></button>
                    </div>
                </div>
            </span>

            <span className="input-row">
                <div className="appointment-half-row-first">
                    <Box sx={{ width: '100%',  bgcolor: 'background.paper', border: '1px solid black' }}>
                        <List component="nav" aria-label="secondary mailbox folder">
                            {selectedParticipants.map((part) => (
                                <ListItemButton
                                    key={part.id}
                                    selected={selectedPartiIndex === part.id}
                                    onClick={(event) => handlePartiItemClick(event, part.id)}
                                >
                                    {isChildrenListView ?
                                        <ListItemText primary={part.firstName + ' ' + part.lastName} />
                                        :
                                        <ListItemText primary={part.name} />
                                    }
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </div>

                <div className="appointment-half-row-second">
                    <div className="table-input-toggle-row">
                        <button onClick={removeParticipant} className="appointment-add-button" type="button"><b>-</b></button>
                    </div>
                </div>
            </span>

        </div>
    );
}