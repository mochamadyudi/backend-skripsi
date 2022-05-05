import { Router } from 'express';
import { UserService } from "@yuyuid/services";
import formidable from 'formidable';
import BodyResponse from "../../../../lib/handler/body-response";
import { CreateFolder, drive, generatePublic, oauth2Client, uploadFile } from "../../../../lib/modules/google-apis";
import { HashId } from "@yuyuid/utils";
import request from "request";
import fs from 'fs';
const route = Router();

export default (app => {
    app.use('/drive', route);
    route.get('/images/:id', async (req, res, next) => {
        try {
            let { id } = req.params;
            let prefix = process.env.PREFIX_DRIVE_URI;
            const url = prefix + id;
            await request.get(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                    return res.status(200).json(data);
                }
            });
        } catch (err) {
            throw next(err);
        }
    });
    route.get('/create/folder', async function (req, res, next) {
        try {
            // oauth2Client.getToken("376975227947-jrl590jgaec1bha42kohshl768gg5p5v.apps.googleusercontent.com").then(function(tokens){
            //     console.log(tokens)
            // }).catch(function(err){
            //     console.log(err)
            // })
            await CreateFolder('travel-apps');
            var folderId = '1LTRVvRUc-Nx_Gpz-Kh53vP1-Gt0vUGkS';
            var fileMetadata = {
                'name': 'photo.jpg',
                parents: [folderId]
            };
            const response = await drive.files.create({
                requestBody: {
                    name: "beautifulfirl.jpg",
                    mimeType: "image/jpg"
                },
                media: {
                    mimeType: "image/jpg"
                    // body: fs.createReadStream(filePath)
                }
            });
            console.log(response.data);
            // console.log("FOLDER : ",folder)

            return res.status(200).json(new BodyResponse({ error: false, message: null, data: "lorem ipsum dolor sit amet" }));
        } catch (err) {
            return res.status(500).json(new BodyResponse({ error: true, message: err.message }));
        }
    });
    route.post('/create/photo', async function (req, res, next) {
        try {
            const form = new formidable.IncomingForm();
            await form.parse(req, async function (err, fields, files, end) {
                const { thumbnail } = files;

                const uploaded = await uploadFile({
                    path: thumbnail.filepath,
                    fileName: thumbnail.newFilename,
                    mimetype: thumbnail.mimetype
                });
                const responsePublic = await generatePublic(uploaded.id);

                return res.status(200).json({ responsePublic, uploaded, prefix_url: process.env.PREFIX_DRIVE_URI });
            });
        } catch (err) {
            throw next(err);
        }
    });
});
//# sourceMappingURL=index.js.map