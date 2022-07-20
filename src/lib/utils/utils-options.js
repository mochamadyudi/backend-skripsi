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

export class OptParams{
    static name(query,obj){
        if(ObjResolve(query,'name')){
            Reflect.set(obj,"name", {
                $exists:true,
                $regex: ObjResolve(query,'name'),
                $options:"-i"
            })
        }
    }
    static slug(query,obj){
        if(ObjResolve(query,'slug')){
            Reflect.set(obj,"slug", {
                $exists:true,
                $regex: ObjResolve(query,'slug'),
                $options:"-i"
            })
        }
    }
    static website(query,obj){
        if(ObjResolve(query,'website')){
            Reflect.set(obj,"website", {
                $exists:true,
                $regex: ObjResolve(query,'website'),
                $options:"-i"
            })
        }
    }
    static Seen(query,obj){
        if(ObjResolve(query,'seen')){
            let item = {}
            if(ObjResolve(query['seen'],'min')){
                Reflect.set(item,"$gt",query?.seen?.min)
            }
            if(ObjResolve(query['seen'],'max')){
                Reflect.set(item,"$lt",query?.seen?.max)
            }
            Reflect.set(obj,"seen", item)

        }
    }
    static isPublished(query,obj){
        if(ObjResolve(query,"is_published")){
            try{
                if(Array.isArray(JSON.parse(ObjResolve(query,'is_published'))) && JSON.parse(ObjResolve(query,'is_published'))?.length > 0){
                    Reflect.set(obj,"is_published", {
                        $exists:true,
                        $in:JSON.parse(ObjResolve(query,'is_published'))
                    })
                }
            }catch(err){

            }
        }
    }
    static isUpdate(query,obj){
        if(ObjResolve(query,"is_update")){
            try{
                if(Array.isArray(JSON.parse(ObjResolve(query,'is_update'))) && JSON.parse(ObjResolve(query,'is_update'))?.length > 0){
                    Reflect.set(obj,"is_update", {
                        $exists:true,
                        $in:JSON.parse(ObjResolve(query,'is_update'))
                    })
                }
            }catch(err){

            }
        }
    }
    static isDeleted(query,obj){
        if(ObjResolve(query,"is_deleted")){
            try{
                if(Array.isArray(JSON.parse(ObjResolve(query,'is_deleted'))) && JSON.parse(ObjResolve(query,'is_deleted'))?.length > 0){
                    Reflect.set(obj,"is_deleted", {
                        $exists:true,
                        $in:JSON.parse(ObjResolve(query,'is_deleted'))
                    })
                }
            }catch(err){

            }
        }
    }
}
