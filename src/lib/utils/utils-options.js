import {v4 as uuidv4} from 'uuid'
import path from "path";
import fs from "fs";
import YuyuidError from "@yuyuid/exception";


export const hashUuid = ()=> {
    return uuidv4()
}

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
export const ToBoolean = (str)=> {
    if(Boolean(JSON.parse(str))) return JSON.parse(str)
    return false
}
export const StrToArr = (str)=> {
    try{
        if(typeof (str) === "string"){
            if(Array.isArray(JSON.parse(str))){
                return JSON.parse(str)
            }
            return []
        }
        return []
    }catch(err){
        return []
    }
}
export const ObjArr = (obj,key = '')=> {
    if(ObjResolve(obj,key)){
        if(Array.isArray(JSON.parse(ObjResolve(obj,key)))){
            return JSON.parse(ObjResolve(obj,key))
        }
    }
    return []
}
export const StrToBool = (str)=> {
    try{
        if(typeof(str) === "string"){
            return str === "true"
        }else if (typeof(str) === "boolean"){
            return str
        }else{
            return false
        }
    }catch(err){
        return false
    }

}


export const clearPath = (filePath,filename)=> {
    let newPath = filePath.toString().split('uploads/')[1].split('/')
    return path.resolve(__dirname,'..','..','..','public','uploads',[...newPath,filename].join('/'))
}

export const GetThumbnailPath = async (filePath,withResize = true, resize = ',_30,_50,_80')=> {
    if (withResize){
        let re = resize.split(",")
        for(let i = 0; i < re.length; i ++){
            let pathSplit = filePath.split(".")
            let NewPath = `${pathSplit[0]}${re[i]}.${pathSplit[1]}`
            if (fs.existsSync(NewPath)) {
                fs.unlink(NewPath,(err)=> {
                    if(err) throw YuyuidError.internal(err.message)

                })
            }
        }
    }else{
        if (fs.existsSync(filePath)) {
            await fs.unlink(filePath,(err)=> {
                if(err) throw YuyuidError.internal(err.message)

            })
        }
    }

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

    static villaNotIn(obj,order,val){
        try{
            Reflect.set(obj, order, {
                $exists: true,
                $nin: val
            })
        }catch(err){

        }
    }
}
