import Box from "@mui/material/Box";
import React from "react";

export const renderAlternativeTable = (alt) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <Box display="block" style={{border: "solid black 1px", padding: "10px"}}>
            <table>
                <tbody>
                <tr>
                    <td><b>Start:</b></td>
                    <td>{new Date(alt.startDate).toLocaleString("de-DE", options)}</td>
                </tr>
                <tr>
                    <td><b>Ende:</b></td>
                    <td>{new Date(alt.endDate).toLocaleString("de-DE", options)}</td>
                </tr>
                </tbody>
            </table>
        </Box>
    );
}