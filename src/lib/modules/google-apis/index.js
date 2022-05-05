import {google} from 'googleapis'
import path from 'path'
import fs from 'fs'
import BodyResponse from "../../handler/body-response";

const CLIENT_ID =  "376975227947-jrl590jgaec1bha42kohshl768gg5p5v.apps.googleusercontent.com"
const CLIENT_SECRET =  "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"

const REFRESH_TOKEN = "4/0AX4XfWgFXh5-WGAdzrHm-nrhVp2V_xylm90JoBz5ixglSkEuofqaGMYqs9g5P1Q3ASkSKg"
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)


const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
];
// oauth2Client.generateAuthUrl({
//     access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
//     scope: scopes // If you only need one scope you can pass it as string
// });
// oauth2Client.getToken("4/0AX4XfWgFXh5-WGAdzrHm-nrhVp2V_xylm90JoBz5ixglSkEuofqaGMYqs9g5P1Q3ASkSKg", (error, response) => {
//     if (error) return console.log('error', error);
//
//     console.log('response', response);
// });

// oauth2Client.getToken(process.env.DRIVE_AUTH ?? "4/0AX4XfWgFXh5-WGAdzrHm-nrhVp2V_xylm90JoBz5ixglSkEuofqaGMYqs9g5P1Q3ASkSKg", function (err, tokens) {
//     if (!err) {
//         oauth2Client.setCredentials(tokens);
//     }
// });
// oauth2Client.
oauth2Client.setCredentials({refresh_token: "4/0AX4XfWgFXh5-WGAdzrHm-nrhVp2V_xylm90JoBz5ixglSkEuofqaGMYqs9g5P1Q3ASkSKg",access_token:"ya29.A0ARrdaM8PnVgePevhqzqsfeevEOyp82tkL8moF68FuXLdGrh-gO1fBW4r5QHPTI88xdF10sglIEtKhHlQIj1Z15b1Sx7bkBxObKG__ZrQj57IWPcSunec8kDpyRTHcSNuhf2DOEl_92MTE83MslSP5CsKrA-u"})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})


async function CreateFolder(name) {
    const fileMetadata = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder"
    }
    try {
        await drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, function (err, file) {
            console.log(err,file)
            if (err) {

                return new BodyResponse({error:true,message:err.message})
            } else {
                return new BodyResponse({data: {file,id:file.id}})
            }
        });

    } catch (err) {

    }
}

async function uploadFile({path,fileName,mimetype}) {
    try {
        var folderId = '1LTRVvRUc-Nx_Gpz-Kh53vP1-Gt0vUGkS';
        var fileMetadata = {
            'name': fileName,
            parents: [ folderId ]
        };
        var media = {
            mimeType: mimetype,
            body: fs.createReadStream(path)
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        })
        return response.data
        // console.log(response.data)
    } catch (err) {

    }
}

async function generatePublic(id){
    try{
        await drive.permissions.create({
            fileId: id,
            requestBody:{
                role:"reader",
                type:"anyone"
            }
        })
        const response =  await drive.files.get({
            fileId:id,
            fields: "webViewLink, webContentLink"
        })
        return response.data
    }catch(err){
        throw err
    }

}

export {
    CreateFolder,
    uploadFile,
    generatePublic,
    drive,
    oauth2Client
}

