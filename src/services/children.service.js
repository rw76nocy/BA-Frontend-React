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

    /*{
                livingGroup : child.livingGroup,
                gender : child.gender,
                image : child.image,
                firstName : child.firstName,
                lastName : child.lastName,
                birthday : child.birthday
            },*/

    /*getLivingGroups() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    getLivingGroup(name) {
        return axios.get(API_URL + 'get/' + name, { headers: authHeader() });
    }

    deleteLivingGroup(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }*/
}

export default new ChildrenService();