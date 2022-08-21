import util from 'util'
import path from 'path'
import multer from 'multer'
import {pathUploadedByDate} from "@yuyuid/utils";

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}
const storage = multer.diskStorage({
    destination: async (req,file,callback)=> {
        const {only_date} = pathUploadedByDate(file.originalname.toString().toLowerCase().replace(/ /g,"-"))
        callback(null, only_date)
    },
    filename: (req,file,callback)=> {
        const filename = `${Date.now()}-uploads-${file.originalname.toString().toLowerCase().replace(/ /g,"-")}`;
        callback(null, filename)
    }
})

const uploadFiles = multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
}).array("files",10);
const uploadFileMiddleware =  util.promisify(uploadFiles);

const uploadFileSingle = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
})

export {
    uploadFileMiddleware,
    uploadFileSingle
}
