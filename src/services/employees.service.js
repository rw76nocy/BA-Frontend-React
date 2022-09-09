import axios from "axios";
import authHeader from "./auth-header";
import {getApiUrl} from "../utils/utils";

const API_URL = getApiUrl("api/test/employees/");

class Employees {

    getEmployees() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }

    getEmployeesById(id) {
        return axios.get(API_URL + 'get/employee/' + id, { headers: authHeader() });
    }

    getEmployeesByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/all/' + livingGroup, { headers: authHeader() });
    }

    getAllEmployeesByLivingGroup(livingGroup) {
        return axios.get(API_URL + 'get/supervisor/all/' + livingGroup, { headers: authHeader() });
    }

    getEmployeesByLivingGroupWithoutAccount(livingGroup) {
        return axios.get(API_URL + 'get/' + livingGroup, { headers: authHeader() });
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