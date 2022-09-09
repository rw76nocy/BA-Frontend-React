import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/accounts/");

class Accounts {
    getAllAccounts() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    getUserAccountByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/' + livingGroup, { headers: authHeader() });
    }

    getAccountById(id) {
        return axios.get(API_URL + 'get/user/' + id, { headers: authHeader() });
    }

    deleteAccount(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }
}

export default new Accounts();