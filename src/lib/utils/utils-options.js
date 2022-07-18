export const DeleteObjKey = async (data,key =[])=> {
    if(typeof(data) !== "undefined" && typeof(data) === "object"){
        for(let i = 0; i < key.length;i++){
            if(typeof(key[i]) !== "undefined"){
                Reflect.deleteProperty(data,key[i])
            }
        }
        return data

    }
}

export const ObjResolve = (obj = {},key = '')=> {
    if(typeof(obj[key]) !== "undefined" && obj[key] !== "" && obj[key] !== null){
        return obj[key]
    }
    return null
}
