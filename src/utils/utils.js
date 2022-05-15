export function findPersonByType(list,type)  {
    let obj = {}
    list.map(p => {
        if (p.role && p.person) {
            if (p.role.type === type) {
                obj = p.person;
            }
        }
    })
    return obj;
}

export function findPersonListByType(list,type)  {
    let arr = [];
    let internalId = 1;
    list.map(p => {
        if (p.role && p.person) {
            if (p.role.type === type) {
                console.log("Object: " + JSON.stringify(p));
                let obj = {};
                obj.internal_id = internalId;
                obj.type = p.role.specification;
                obj.id = p.person.id;
                obj.gender = p.person.gender;
                obj.name = p.person.name;
                obj.phone = p.person.phone;
                obj.fax = p.person.fax;
                obj.email = p.person.email;
                obj.birthday = p.person.birthday;
                obj.address = p.person.address;
                obj.livingGroup = p.person.livingGroup;
                arr.push(obj);
                internalId += 1;
            }
        }
    })
    return arr;
}

export function findInstitutionByType(list,type)  {
    let obj = {}
    list.map(i => {
        if (i.role && i.institution) {
            if (i.role.type === type) {
                obj = i.institution;
            }
        }
    })
    return obj;
}

export function isJsonEmpty(json) {
    return JSON.stringify(json) === "{}";
}

export function isJsonArrayEmpty(jsonArray) {
    return JSON.stringify(jsonArray) === "[]";
}


