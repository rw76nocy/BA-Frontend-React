import AppointmentService from "../services/appointment.service";
import AuthService from "../services/auth.service";
import Accounts from "../services/accounts.service";
import EmployeesService from "../services/employees.service";
import ChildrenService from "../services/children.service";

export async function getAppointmentResources() {
    let arr = [];
    arr.push(await getLocationResources());
    arr.push(await getAppointmentTypeResources());
    arr.push(await getMemberResources());
    arr.push(await getChildrenResources());
    return arr;
}

const getLocationResources = async () => {
    let obj = {};
    let instances = [];
    let data = await loadAppointments();

    data.map(a => {
        let ins = {};
        ins.id = a.location;
        ins.text = a.location;
        ins.color = "#ffffff";

        let isDuplicate = false;
        instances.map(i => {
            if (i.text === ins.text) {
                isDuplicate = true;
            }
        });

        if (!isDuplicate) {
            instances.push(ins);
        }
    })

    obj.fieldName = "location";
    obj.title = "Ort";
    obj.instances = instances;

    return obj;
}

const getAppointmentTypeResources = async () => {
    let obj = {};
    let instances = [];
    let data = await loadAppointmentTypes();

    data.map(at => {
        let ins = {};
        ins.id = at.name;
        ins.text = at.name;
        ins.color = at.color;
        instances.push(ins);
    })

    obj.fieldName = "type";
    obj.title = "Terminart";
    obj.instances = instances;

    return obj;
}

const getMemberResources = async () => {
    let obj = {};
    let instances = [];
    let data = await loadMembers();

    data.map(mem => {
        let ins = {};
        ins.id = mem.name;
        ins.text = mem.name;
        ins.color = "#d1bc8a";
        instances.push(ins);
    })

    obj.fieldName = "members";
    obj.title = "Teilnehmer";
    obj.allowMultiple = true;
    obj.instances = instances;

    return obj;
}

const getChildrenResources = async () => {
    let obj = {};
    let instances = [];
    let data = await loadChildren();

    data.map(c => {
        let ins = {};
        ins.id = c.fullName;
        ins.text = c.fullName;
        ins.color = "#000000";
        instances.push(ins);
    })

    obj.fieldName = "children";
    obj.title = "Kinder";
    obj.allowMultiple = true;
    obj.instances = instances;

    return obj;
}

const loadAppointments = async () => {
    let id = AuthService.getCurrentUser().id;
    const account = await Accounts.getAccountById(id);
    const appointments = await AppointmentService.getAppointmentsByLivingGroup(account.data.person.livingGroup.name);
    return appointments.data;
}

export async function loadAppointmentTypes() {
    let id = AuthService.getCurrentUser().id;
    const account = await Accounts.getAccountById(id);
    const types = await AppointmentService.getAppointmentTypesByLivingGroup(account.data.person.livingGroup.name);
    return types.data;
}

const loadMembers = async () => {
    let id = AuthService.getCurrentUser().id;
    const account = await Accounts.getAccountById(id);
    const members = await EmployeesService.getAllEmployeesByLivingGroup(account.data.person.livingGroup.name);
    return members.data;
}

const loadChildren = async () => {
    let id = AuthService.getCurrentUser().id;
    const account = await Accounts.getAccountById(id);
    const children = await ChildrenService.getChildrenByLivingGroup(account.data.person.livingGroup.name);
    return children.data;
}