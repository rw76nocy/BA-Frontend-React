import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/children/");

class ChildrenService {

    getChildrenByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/all/' + livingGroup, { headers: authHeader() });
    }

    addChild(child) {
        return axios.post(
            API_URL + 'add/',
            child,
            { headers : authHeader() });
    }

    updateChild(child) {
        return axios.post(
            API_URL + 'update/',
            child,
            { headers : authHeader() });
    }

    deleteChild(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }
}

export default new ChildrenService();