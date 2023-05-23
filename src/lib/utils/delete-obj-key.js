export const DeleteObjKey = async (data,key =[])=> {
    try {
        if(typeof(data) !== "undefined" && typeof(data) === "object"){
            for(let i = 0; i < key.length;i++){
                if(typeof(key[i]) !== "undefined"){
                    if('deleteProperty' in Reflect){
                        Reflect.deleteProperty(data,key[i])
                    }
                }
            }
            return data
        }
        return null
    }catch(err){
        return null
    }
}