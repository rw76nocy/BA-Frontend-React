import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/appointments/");

class AppointmentService {

    getAppointmentsByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/all/' + livingGroup, { headers: authHeader() });
    }

    checkOverlaps(appointment) {
        return axios.post(
            API_URL + 'check/',
            appointment,
            { headers : authHeader() });
    }

    getEarlierAlternatives(appointment) {
        return axios.post(
            API_URL + 'alternative/earlier',
            appointment,
            { headers : authHeader() });
    }

    getLaterAlternatives(appointment) {
        return axios.post(
            API_URL + 'alternative/later',
            appointment,
            { headers : authHeader() });
    }

    addAppointment(appointment) {
        return axios.post(
            API_URL + 'add/',
            appointment,
            { headers : authHeader() });
    }

    updateAppointment(appointment) {
        return axios.post(
            API_URL + 'update/',
            appointment,
            { headers : authHeader() });
    }

    deleteAppointment(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }

    getAppointmentTypesByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/types/all/' + livingGroup, { headers: authHeader() });
    }

    addAppointmentType(appointmentType) {
        return axios.post(
            API_URL + 'add/type/',
            appointmentType,
            { headers : authHeader() });
    }

    updateAppointmentType(appointmentType) {
        return axios.post(
            API_URL + 'update/type/',
            appointmentType,
            { headers : authHeader() });
    }

    deleteAppointmentType(id) {
        return axios.delete(API_URL + 'delete/type/' + id, { headers : authHeader() });
    }

}

export default new AppointmentService();