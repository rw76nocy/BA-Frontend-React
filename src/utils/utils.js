import AuthService from "../services/auth.service";
import {toast} from "react-toastify";
import parse from "html-react-parser";
import React from "react";

export function findPersonByType(list,type)  {
    let obj = {}
    list.map(p => {
        if (p.role && p.person) {
            if (p.role.type === type) {
                obj = p.person;
            }
        }
    })
    return obj;
}

export function findPersonListByType(list,type)  {
    let arr = [];
    let internalId = 1;
    list.map(p => {
        if (p.role && p.person) {
            if (p.role.type === type) {
                let obj = {};
                obj.internal_id = internalId;
                obj.type = p.role.specification;
                obj.id = p.person.id;
                obj.gender = p.person.gender;
                obj.name = p.person.name;
                obj.phone = p.person.phone;
                obj.fax = p.person.fax;
                obj.email = p.person.email;
                obj.birthday = p.person.birthday;
                obj.address = p.person.address;
                obj.livingGroup = p.person.livingGroup;
                arr.push(obj);
                internalId += 1;
            }
        }
    })
    return arr;
}

export function findInstitutionByType(list,type)  {
    let obj = {}
    list.map(i => {
        if (i.role && i.institution) {
            if (i.role.type === type) {
                obj = i.institution;
            }
        }
    })
    return obj;
}

export function isJsonEmpty(json) {
    return JSON.stringify(json) === "{}";
}

export function isJsonArrayEmpty(jsonArray) {
    return JSON.stringify(jsonArray) === "[]";
}

export function isDateValid(date) {
    let d = new Date(date);
    return d.getTime() === d.getTime();
}

export function isAfter(date1,date2) {
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    return d1 > d2;
}

export function toastError(error) {
    const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message || error.toString();
    toast.error(<div>{parse(errorMessage)}</div>);
}

export function handleError(error) {
    const errorStatus =
        (error.response && error.response.data && error.response.data.status) ||
        error.status || error.toString();
    if (errorStatus === 401) {
        AuthService.navigateToLogin();
    } else {
        toastError(error);
    }
}

export function formatErrorMessage(errors) {
    let message = "<b>Fehler</b><br/><br/>"
    message = message.concat("<ul>")
    errors.map(error => {
        message = message.concat("<li>");
        message = message.concat(error);
        message = message.concat("</li>");
    });
    message = message.concat("</ul>")
    return <div>{parse(message)}</div>
}

export function getApiPrefix() {
    return `http://${window.location.hostname}:8080/`;
}

export function getApiUrl(path) {
    return `${getApiPrefix()}${path}`;
}


