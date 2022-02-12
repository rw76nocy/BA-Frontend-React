import axios from "axios";
import authHeader from "./auth-header";

const API_URL = 'http://localhost:8080/api/test/livinggroup/';



class LivingGroup {

    getLivingGroups() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    getLivingGroup(name) {
        return axios.get(API_URL + 'get/' + name, { headers: authHeader() });
    }

    addLivingGroup(name) {
        return axios.post(API_URL + 'add', { name }, { headers : authHeader() });
    }

    deleteLivingGroup(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }
}

export default new LivingGroup();