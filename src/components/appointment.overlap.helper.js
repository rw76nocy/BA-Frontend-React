import Box from "@mui/material/Box";
import React from "react";

export const renderOverlapTable = (overlap) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const keyTranslations = {
        title: 'Titel:',
        startDate : 'Start:',
        endDate: 'Ende:',
        members: 'Betroffene Teilnehmer:',
        children: 'Betroffene Kinder:'
    }

    const getKeyTranslation = (key) => {
        const trans = keyTranslations[key];
        if (trans) {
            return trans;
        }
        return key;
    }

    const getValueTranslation = (key,value) => {
        switch (key) {
            case 'startDate':
            case 'endDate': return new Date(value).toLocaleString("de-DE", options);
            case 'members':
            case 'children': {
                return (
                    <ul style={{marginBottom: "0px"}}>
                        {value.map(c => {
                            return <li key={c}>{c}</li>;
                        })}
                    </ul>
                );
            }
            default: return value;
        }
    }

    const getStyleByKey = (key) => {
        switch (key) {
            case 'members':
            case 'children': return {verticalAlign: "top"};
            default: return {paddingLeft: "20px"};
        }
    }

    const getRowByKeyValue = (key, value) => {
        switch (key) {
            case 'title':
            case 'startDate':
            case 'endDate': {
                return (
                    <tr>
                        <td><b>{getKeyTranslation(key)}</b></td>
                        <td style={getStyleByKey(key)}>{getValueTranslation(key, value)}</td>
                    </tr>
                );
            }
            case 'members':
            case 'children': {
                if (value.length > 0) {
                    return (
                        <tr>
                            <td style={getStyleByKey(key)}><b>{getKeyTranslation(key)}</b></td>
                            <td>{getValueTranslation(key, value)}</td>
                        </tr>
                    );
                }
            }
        }
    }

    return (
        <Box display="block" style={{border: "solid black 1px", padding: "10px"}}>
            <table>
                <tbody>
                {Object.entries(overlap).map(([key, value]) => {
                    return getRowByKeyValue(key, value);
                })}
                </tbody>
            </table>
        </Box>
    );
}