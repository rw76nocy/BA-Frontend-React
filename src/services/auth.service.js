import axios from "axios";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/auth/");

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then( response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password, role, employeeId) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password,
            role,
            employeeId
        });
    }

    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            return null;
        }
        const isExpired = new Date(Number(user.expiration)) < new Date().getTime();
        if (isExpired) {
            return null;
        }
        return user;
    }

    navigateToLogin() {
        window.location.assign('/login');
    }
}

export default new AuthService();