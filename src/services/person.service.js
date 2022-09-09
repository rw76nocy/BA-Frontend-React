import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/persons/");

class Persons {

    getPersonById(id) {
        return axios.get(API_URL + 'get/' + id, { headers: authHeader() });
    }

    getAsdById(id) {
        return axios.get(API_URL + 'get/asd/' + id, { headers: authHeader() });
    }

    getAllGuardians() {
        return axios.get(API_URL + 'get/guardian/all', { headers: authHeader() });
    }

    getAllAsds() {
        return axios.get(API_URL + 'get/asd/all', { headers: authHeader() });
    }

    getAllChilddoctors() {
        return axios.get(API_URL + 'get/childdoctor/all', { headers: authHeader() });
    }
}

export default new Persons();