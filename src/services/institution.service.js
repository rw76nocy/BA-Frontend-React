import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/institutions/");

class Institutions {

    getInstitutionById(id) {
        return axios.get(API_URL + 'get/' + id, { headers: authHeader() });
    }

    getDaycareById(id) {
        return axios.get(API_URL + 'get/daycare/' + id, { headers: authHeader() });
    }

    getHealthinsuranceById(id) {
        return axios.get(API_URL + 'get/healthinsurance/' + id, { headers: authHeader() });
    }

    getFoodsupplierById(id) {
        return axios.get(API_URL + 'get/foodsupplier/' + id, { headers: authHeader() });
    }

    getAllInstitutions() {
        return axios.get(API_URL + 'get/all', { headers: authHeader() });
    }

    getAllDaycares() {
        return axios.get(API_URL + 'get/daycare/all', { headers: authHeader() });
    }

    getAllHealthinsurances() {
        return axios.get(API_URL + 'get/healthinsurance/all', { headers: authHeader() });
    }

    getAllFoodsuppliers() {
        return axios.get(API_URL + 'get/foodsupplier/all', { headers: authHeader() });
    }

    getAllDrivers() {
        return axios.get(API_URL + 'get/driver/all', { headers: authHeader() });
    }
}

export default new Institutions();