import multer from 'multer'
import path from 'path'
import {MulterPathImagesWithHasId} from "@yuyuid/utils";
import moment from "moment";

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "..", "..", "public", "uploads"))
    },
    filename: function (req,file,cb){
        cb(null,)
    }
})


export {
    diskStorage
}
