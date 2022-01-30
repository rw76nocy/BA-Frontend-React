import axios from "axios";
import authHeader from "./auth-header";

const API_URL = 'http://localhost:8080/api/test/employees/';



class Employees {

    getEmployees() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    addEmployee(gender, name, phone, fax, email, birthday, address, livingGroup) {
        return axios.post(
            API_URL + 'add',
            {
                gender: gender,
                name: name,
                phone: phone,
                fax: fax,
                email: email,
                birthday: birthday,
                address: address,
                livingGroup: livingGroup
            },
            { headers: authHeader() });
    }

    updateEmployee(id, gender, name, phone, fax, email, birthday, address, livingGroup) {
        return axios.put(
            API_URL + 'put/' + id,
            {
                gender: gender,
                name: name,
                phone: phone,
                fax: fax,
                email: email,
                birthday: birthday,
                address: address,
                livingGroup: livingGroup
            },
            { headers: authHeader() });
    }

    deleteEmployee(id) {
        return axios.delete(API_URL + 'delete/' + id, { headers : authHeader() });
    }
}

export default new Employees();