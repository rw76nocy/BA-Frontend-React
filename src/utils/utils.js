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

export function isJsonEmpty(json) {
    return JSON.stringify(json) === "{}";
}

export function propExist(prop) {
    return typeof prop === 'function';
}


