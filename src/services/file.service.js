import axios from "axios";
import authHeader from "./auth-header";
import authFileHeader from "./auth-file-header";

const API_URL = 'http://localhost:8080/api/test/files/';

class ChildrenService {

    getAllFiles() {
        return axios.get(API_URL + 'all/', { headers: authHeader() });
    }

    getFile(childId) {
        return axios.get(API_URL + 'file/' + childId, { headers: authHeader(), responseType: "blob" });
    }

    uploadFile(file) {
        return axios.post(
            API_URL + 'upload/',
            file,
            { headers : authFileHeader() });
    }

    updateFile(file) {
        return axios.post(
            API_URL + 'update/',
            file,
            { headers : authFileHeader() });
    }

}

export default new ChildrenService();