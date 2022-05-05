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
    return `${moment().format('DD_MMM_YYYY_H')}_${makeid(5)}_${filename.toString().toLowerCase().split(".")[0]}.${ext}`
}
export {
    changeFileName,
    getPathUploadsImages,
    uploadVideoWithHashFolder,
    uploadImageWithHashFolder,
    getPathUploads
}
