import axios from "axios";
import authHeader from "./auth-header";

const API_URL = 'http://localhost:8080/api/test/institutions/';

class Institutions {

    getInstitutionById(id) {
        return axios.get(API_URL + 'get/' + id, { headers: authHeader() });
    }

    getDaycareById(id) {
        return axios.get(API_URL + 'get/daycare/' + id, { headers: authHeader() });
    }

    getHealthinsuranceById(id) {
        return axios.get(API_URL + 'get/healthinsurance/' + id, { headers: authHeader() });
    }

    getFoodsupplierById(id) {
        return axios.get(API_URL + 'get/foodsupplier/' + id, { headers: authHeader() });
    }

    getAllInstitutions() {
        return axios.get(API_URL + 'get/all', { headers: authHeader() });
    }

    getAllDaycares() {
        return axios.get(API_URL + 'get/daycare/all', { headers: authHeader() });
    }

    getAllHealthinsurances() {
        return axios.get(API_URL + 'get/healthinsurance/all', { headers: authHeader() });
    }

    getAllFoodsuppliers() {
        return axios.get(API_URL + 'get/foodsupplier/all', { headers: authHeader() });
    }

    getAllDrivers() {
        return axios.get(API_URL + 'get/driver/all', { headers: authHeader() });
    }




    /*getEmployees() {
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
    }*/
}

export default new Institutions();