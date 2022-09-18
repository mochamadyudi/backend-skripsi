import {isAdmins} from "../../../middlewares/auth";
import {Router} from "express";
import formidable from "formidable";
import Category from './category'
import mv from 'mv'
import waterfall from "async-waterfall"
import fs from 'fs'

import path from 'path'
import {
    changeFileName,
    getPathUploadsImages,
    HashId, pathUploadedByDate,
    uploadImageWithHashFolder,
    uploadVideoWithHashFolder
} from "@yuyuid/utils";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {TravelCategory} from "../../../../models/travel/travel_categories.schema.";
import {TravelLikes} from "../../../../models/travel/travel_likes.schema";
import {TravelRating} from "../../../../models/travel/travel_rating.schema";
import {TravelService} from "@yuyuid/services";

export default () => {
    const app = Router()
    app.use(isAdmins)

    Category(app)

    /**
     * CREATE TRAVEL
     */
    app.post('/create', async (req, res) => {
        try {
            let travel = new Travel({
                ...req.body
            })
            let likes = await new TravelLikes({
                travel: travel?.id,
            })
            let discuss = await new TravelDiscuss({
                travel: travel?.id
            });
            let rating = await new TravelRating({
                travel: travel?.id
            })

            await travel.save()
            await likes.save();
            await discuss.save();
            await rating.save();
            console.log({travel})
            return res.json({
                error: false,
                message: "successfully",
                data: travel
            })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })
    app.put('/update/photos', async (req, res, next) => {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                let images = []
                let newImages = []
                for (let i = 0; i < 10; i++) {
                    if (typeof (files[`thumbnail[${i}]`]) !== "undefined") {
                        let item = files[`thumbnail[${i}]`];
                        var oldpath = item.filepath;

                        let fileCheck = false
                        let fileExtensions = null
                        switch (item.mimetype) {
                            case "image/png":
                                fileCheck = true
                                fileExtensions = "png"
                                break;
                            case "image/jpeg":
                                fileCheck = true
                                fileExtensions = "jpeg"
                                break;
                            case "image/jpg":
                                fileCheck = true
                                fileExtensions = "jpg"
                                break;
                            default:
                                fileCheck = false
                                break
                        }
                        if (fileCheck) {

                            let filename = changeFileName(item.originalFilename.toString().toLowerCase().replace(/ /g, "_"), fileExtensions)
                            const {prefix_date, path_full, only_date} = pathUploadedByDate(filename)

                            newImages.push({
                                original_filename: item.originalFilename,
                                name: filename,
                                prefix: `${process.env.PREFIX_URL}`,
                                url: `${prefix_date}/${filename}`
                            })
                            images.push({
                                oldpath,
                                newpath: path_full,
                            })
                        }

                    }
                }

                for (let i = 0; i < images.length; i++) {
                    let item = images[i]
                    mv(item.oldpath, item.newpath, function (err) {
                        if (err) throw err;
                    })
                }

                const travels = await Travel.findOneAndUpdate(
                    {_id: fields.id},
                    {
                        $set: {
                            photo: newImages
                        }
                    },
                    {new: true}
                )
                return res.json({
                    error: false,
                    message: "Successfully!",
                    data: travels

                }).status(200)
            });


        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    app.put('/update/videos', async (req, res, next) => {
        try {
            var form = new formidable.IncomingForm();
            // let forms = {
            //     id : null,
            //     video: []
            // }
            form.parse(req, async function (err, fields, files) {
                let video = []
                let newVideo = []
                for (let i = 0; i < 10; i++) {
                    if (typeof (files[`videos[${i}]`]) !== "undefined") {
                        let item = files[`videos[${i}]`];
                        var oldpath = item.filepath;

                        if (item.mimetype === "video/mp4") {
                            let filename = changeFileName(files.thumbnail.originalFilename.toString().toLowerCase().replace(/ /g, "_"), "mp4")
                            const {prefix_date, path_full, only_date} = pathUploadedByDate(filename)
                            // let filename = changeFileName(item.originalFilename.replace(/ /g, "_"), "mp4")
                            // const filePath = uploadVideoWithHashFolder(fields?.id, filename)

                            newVideo.push({
                                original_filename: item.originalFilename,
                                name: filename,
                                prefix: `${process.env.PREFIX_URL}/public/uploads`,
                                url: `${prefix_date}/${filename}`
                            })
                            video.push({
                                oldpath,
                                newpath: path_full,
                            })
                        }
                    }
                }

                for (let i = 0; i < video.length; i++) {
                    let item = video[i]
                    mv(item.oldpath, item.newpath, function (err) {
                        if (err) throw err;
                    })
                }
                const travels = await Travel.findOneAndUpdate(
                    {_id: fields.id},
                    {
                        $set: {
                            video: newVideo
                        }
                    },
                    {new: true}
                )
                return res.json({
                    error: false,
                    message: "Successfully!",
                    data: travels

                }).status(200)

            });


        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    app.get('/list', TravelService._getTravelLists)

    app.get('/update/published/:id', async (req, res) => {
        try {
            const {id} = req.params
            await Travel.findOneAndUpdate(
                {_id: id},
                {
                    $set: {
                        is_published: 1
                    },
                }, {
                    new: true
                }
            ).then((field) => {
                if (field !== null) {
                    return res.json({
                        error: false,
                        message: `Successfully! ${field?.travel_name} is updated!`,
                        data: field
                    })
                } else {
                    return res.json({
                        error: true,
                        message: `travel ${id} not found!`,
                        data: null
                    })
                }
            })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })


    app.delete("/delete/:id", TravelService._deleteTravelById)

    return app


}
