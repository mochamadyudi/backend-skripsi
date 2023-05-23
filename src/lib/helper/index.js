import 'dotenv/config';
import path from "path";
import fs from "fs";
import moment from "moment";
export * from './jwt-token';
export * from './pagination';

const ObjResolve = function(obj = {},key = ''){
    if( obj &&  Object.keys(obj).length > 0 && typeof(obj[key]) !== "undefined" && obj[key] !== "" && obj[key] !== null){
        Reflect.set(obj,key,obj[key])

        return obj[key]
    }
    return null
}

const StrToBoolean = function(str,val = '') {
    try{
        if(typeof(str) !== "undefined" && str !== null && str !== ""){
            if(typeof(val) !== 'undefined' && str === val){
                return true
            }
            if(Boolean(str)){
                return JSON.parse(str)
            }
        }
        return false
    }catch(err){
        return false
    }
}

const QueryResolve = (obj = {},key = '')=> {
    if( obj &&  Object.keys(obj).length > 0 && typeof(obj[key]) !== "undefined" && obj[key] !== "" && obj[key] !== null){
        Reflect.set(obj,key,obj[key])

        return obj[key]
    }
    return null
}


/**
 *
 * @param {String} filename
 * @param {(String|"uploads")}prefix
 * @returns {string}
 * @constructor
 */
export function ConvertFilenameUpload(filename,prefix='upload'){
    return `${Date.now()}-uploads-${filename.toString().toLowerCase().replace(/ /g,'-')}`
}

/**
 * @param {(Array|[])}date
 * @param {String} filename
 * @returns {string}
 * @constructor
 */
export function PathWithYMD(date = [],filename = ""){

    if (date.length  === 3){
        let dir = path.resolve(__dirname,"..","..","..","storage","uploads",date[0])
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)

            let dirMonth = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1])
            if (!fs.existsSync(dirMonth)) {
                fs.mkdirSync(dirMonth)

                let dirDay = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)
                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }
            }else{
                let dirDay = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)

                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }

            }
        }else{
            let dirMonth = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1])
            if (!fs.existsSync(dirMonth)) {
                fs.mkdirSync(dirMonth)

                let dirDay = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)
                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }
            }else{
                let dirDay = path.resolve(__dirname,"..","..","..","storage","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)
                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }

            }
        }
    }
}

/**
 *
 * @param {String} filename
 * @returns {{path_full: string, only_date: string, prefix_date: string}}
 */
export function pathUploadedByDate(filename){
    let dates = moment(Date.now()).format("YYYY-MM-DD").split("-")
    let fullPath =  PathWithYMD([...dates],filename)
    let onlydate =  PathWithYMD([...dates])
    return {
        prefix_date: `/${dates.join("/")}`,
        path_full: fullPath,
        only_date:onlydate
    }
}

/**
 *
 * @param {String} filename
 * @param {String} ext
 * @returns {{path: string, filename: string, destination: string, dir: string}}
 */
export function pathUploadTemplate(filename,ext = '.zip'){
    let newFilename = filename.toString().toLowerCase().replace(/ /g,'-')
    let onlyFilename = newFilename.replace(ext,'');
    let dir = path.resolve(__dirname,"..","..","..","storage","templates")
    let dest = path.join(dir,onlyFilename)
    let uploaded = path.join(dir,newFilename)
    // if(!fs.existsSync(dest)){
    //     fs.mkdirSync(dest)
    // }
    return {
        dir:dir,
        filename:onlyFilename,
        destination: dest,
        path: uploaded
    }
}

/**
 * @param destination
 */
export async function deleteFile(destination){
    if(fs.existsSync(destination)){
        fs.unlinkSync(destination)
    }
}


/**
 *
 * @param {String} str
 * @param {String} replaceTo
 * @returns {string}
 */
export function strFormat(str, replaceTo = ''){
    return str.toString().toLowerCase().replace(/ /g,replaceTo)
}

/**
 * @param obj
 * @returns {TModelAttributes}
 * @constructor
 */
export const ClearSequel = (obj) => {
    obj = obj?.dataValues ?? obj
    return obj
}

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


export function isJSONString(str){
    try{
        return [ null, JSON.parse(str)]
    }catch (err){
        return [ err, null ]
    }
}



let Helper = {
    ObjResolve,
    StrToBoolean,
    QueryResolve
}

global.Helper = Helper
Object.keys(Helper).forEach((key)=> {
    global[key]= Helper[key]
})

export  { Helper }