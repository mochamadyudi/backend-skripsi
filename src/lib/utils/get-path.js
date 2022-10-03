import path from 'path'
import fs from 'fs'
import moment from "moment";
import {makeid} from "./hash";
function getPathUploadsImages(filename = null){
    if (filename !== null){
        return path.resolve(__dirname, "..","..","..","public","uploads","images",filename)
    }
    return path.resolve(__dirname, "..","..","..","public","uploads","images")
}

function getPathUploads(filename = null){
    if (filename !== null){
        return path.resolve(__dirname, "..","..","..","public","uploads",filename)
    }
    return path.resolve(__dirname, "..","..","..","public","uploads")
}

function PathWithYMD(date = [],filename = ""){

    // let array = [__dirname,"..","..","..","public","uploads"];
    if (date.length  === 3){

        let dir = path.resolve(__dirname,"..","..","..","public","uploads",date[0])
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)

            let dirMonth = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1])
            if (!fs.existsSync(dirMonth)) {
                fs.mkdirSync(dirMonth)

                let dirDay = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)
                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }
            }else{
                let dirDay = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)

                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }

            }
        }else{
            let dirMonth = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1])
            if (!fs.existsSync(dirMonth)) {
                fs.mkdirSync(dirMonth)

                let dirDay = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1],date[2])
                if (!fs.existsSync(dirDay)) {
                    fs.mkdirSync(dirDay)
                    return path.join(dirDay,filename)
                }else{
                    return path.join(dirDay,filename)
                }
            }else{
                let dirDay = path.resolve(__dirname,"..","..","..","public","uploads",date[0],date[1],date[2])
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



function pathUploadedByDate(filename){
    let dates = moment().format("YYYY-MM-DD").split("-")
    let fullPath =  PathWithYMD([...dates],filename)
    let onlydate =  PathWithYMD([...dates])
    return {
        prefix_date: `/${dates.join("/")}`,
        path_full: fullPath,
        only_date:onlydate
    }
}

function MulterPathImagesWithHasId(date = [],filename){

    let dir = path.resolve(__dirname, "..","..","..","public","uploads","images", date.join(""))
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        return path.join(dir,filename)
    }else{
        return path.join(dir,filename)
    }
}

function uploadImageWithHashFolder(hashId,filename = null){

    let dir = path.resolve(__dirname, "..","..","..","public","uploads","images", hashId)
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        return path.join(dir,filename)
    }else{
        return path.join(dir,filename)
    }
}




function uploadVideoWithHashFolder(hashId,filename = null){

    let dir = path.resolve(__dirname, "..","..","..","public","uploads","videos", hashId)
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        return path.join(dir,filename)
    }else{
        return path.join(dir,filename)
    }
}

function changeFileName (filename = null,ext = "png"){
    if (filename === null) return null
    return `${makeid(5)}_${filename.toString().toLowerCase().split(".")[0]}.${ext}`
}
export {
    PathWithYMD,
    pathUploadedByDate,
    MulterPathImagesWithHasId,
    changeFileName,
    getPathUploadsImages,
    uploadVideoWithHashFolder,
    uploadImageWithHashFolder,
    getPathUploads
}
