import axios from 'axios';

const USERS_REST_API_URL = 'http://192.168.178.21:8080/api/users';

class UserService {
    getUsers() {
        return axios.get(USERS_REST_API_URL);
    }
}

export default new UserService()