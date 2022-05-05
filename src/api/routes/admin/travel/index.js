import {isAdmins} from "../../../middlewares/auth";
import {Router} from "express";
import formidable from "formidable";
import Category from './category'
import mv from 'mv'
import fs from 'fs'

import path from 'path'
import {
    changeFileName,
    getPathUploadsImages,
    HashId,
    uploadImageWithHashFolder,
    uploadVideoWithHashFolder
} from "@yuyuid/utils";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {TravelCategory} from "../../../../models/travel/travel_categories.schema.";
import {TravelLikes} from "../../../../models/travel/travel_likes.schema";

export default () => {
    const app = Router()
    app.use(isAdmins)

    Category(app)

    /**
     * CREATE TRAVEL
     */
    app.post('/create', async (req, res) => {
        try {
            const travel = new Travel({
                ...req.body
            })
            await travel.save();

            await new TravelLikes({
                travel:travel?.id,
            }).save()
            await new TravelDiscuss({
                travel:travel?.id
            }).save();

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
                            const filePath = uploadImageWithHashFolder(fields?.id, filename)
                            newImages.push({
                                original_filename: item.originalFilename,
                                name: filename,
                                prefix: `/public/uploads/images/`,
                                url: `/${fields?.id}/${filename}`
                            })
                            images.push({
                                oldpath,
                                newpath: filePath,
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
                            let filename = changeFileName(item.originalFilename.replace(/ /g, "_"), "mp4")
                            const filePath = uploadVideoWithHashFolder(fields?.id, filename)
                            newVideo.push({
                                original_filename: item.originalFilename,
                                name: filename,
                                prefix: `/public/uploads/videos/`,
                                url: `/${fields?.id}/${filename}`
                            })
                            video.push({
                                oldpath,
                                newpath: filePath,
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



    app.get('/list', async (req,res)=> {
        try{

            const {page, limit, direction} = Pagination(req.query)

            const user = await Travel.find().populate("categories.category", ['slug', 'name','is_verify','is_published'])
                // .and(options)
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })


            const count = await Travel.find()
                // .and(options)
                .count()


            return res.json({
                error: false,
                message: null,
                query: {
                    limit,
                    page: page > 0 ? page : 1,
                    direction,
                },
                pagination: {
                    total_page: limit > 0 ? Math.ceil(count / limit) : 1,
                    current_page: page > 0 ? page : 1,
                    total_record: count,
                },
                data: user
            })

            return res.json({
                error:false,
                message: null,
                data: null
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null,
            })
        }
    })

    app.get('/update/published/:id', async (req,res)=> {
        try{
            const {id} = req.params
            await Travel.findOneAndUpdate(
                {_id:id},
                {$set:{
                    is_published: 1
                    },
            },{
                    new :true
                }
            ).then((field)=> {
                if(field !== null){
                    return res.json({
                        error:false,
                        message: `Successfully! ${field?.travel_name} is updated!`,
                        data: field
                    })
                }else{
                    return res.json({
                        error:true,
                        message: `travel ${id} not found!`,
                        data: null
                    })
                }
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    })
    return app


}
