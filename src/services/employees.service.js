import axios from "axios";
import authHeader from "./auth-header";

const API_URL = 'http://localhost:8080/api/test/employees/';



class Employees {

    getEmployees() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    addEmployee(gender, livingGroup, name, birthday, address, phone, email) {
        return axios.post(
            API_URL + 'add',
            {
                gender: gender,
                livingGroup: livingGroup,
                name: name,
                birthday: birthday,
                address: address,
                phone: phone,
                email: email
            },
            /*{gender, livingGroup, name, birthday, address, phone, email},*/
            { headers: authHeader() });
    }

    /*addLivingGroup(name) {
        return axios.post(API_URL + 'add', { name }, { headers : authHeader() });
    }

    deleteLivingGroup(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }*/
}

export default new Employees();