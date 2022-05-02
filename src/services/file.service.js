import axios from "axios";
import authHeader from "./auth-header";
import authFileHeader from "./auth-file-header";

const API_URL = 'http://localhost:8080/api/test/files/';

class ChildrenService {

    getAllFiles() {
        return axios.get(API_URL + 'all/', { headers: authHeader() });
    }

    getFile(id) {
        return axios.get(API_URL + 'file/' + id, { headers: authHeader() });
    }

    uploadFile(file) {
        return axios.post(
            API_URL + 'upload/',
            file,
            { headers : authFileHeader() });
    }

}

export default new ChildrenService();