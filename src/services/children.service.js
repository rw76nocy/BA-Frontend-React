import axios from "axios";
import authHeader from "./auth-header";

const API_URL = 'http://localhost:8080/api/test/children/';

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

}

export default new ChildrenService();