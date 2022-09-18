import {Router} from 'express'
import RoomController from "../../../../controllers/room.controller";
import {uploadFileMiddleware} from "../../../../lib/modules/uploaded";
import {Room} from "@yuyuid/models";
import sharp from "sharp";
import first from 'lodash'
import fs from "fs";
import path from 'path'
import ResizeModule from "../../../../lib/modules/resize.module";
import {RoomsValidator} from "../../../../lib/validator";
import {clearPath, GetThumbnailPath} from "@yuyuid/utils";

const route = Router()
export default (app) => {
    app.use("/rooms", route)

    route.post('/create', RoomsValidator.Create, new RoomController().create)

    route.put('/update/photo/:id', uploadFileMiddleware, async (req, res) => {

        try {
            let {id} = req.params
            let files = []
            if (typeof (req?.files) !== "undefined") {
                if (Array.isArray(req.files) && req.files.length > 0) {
                    for (let i = 0; i < req.files.length; i++) {
                        /**
                         * RESIZE [ 70, 50, 30 ]
                         */
                        let filename = req.files[i].filename.toString().toLowerCase().replace(/ /g, "-")
                        await new ResizeModule({
                            filename: filename,
                            destination: req.files[i].destination,
                            path: req.files[i].path,
                            resize: [80, 50]
                        })
                        files.push({
                            prefix_url: `${process.env.APP_URL}/public${req.files[i].destination.split("public")[1].replace(/\\/g, '/')}`,
                            original_name: req.files[i]?.originalname,
                            filename: filename,
                            path: ['public', `${req.files[i].destination.split("public")[1].replace(/\\/g, '/')}`].join('')
                        })

                    }
                }

            }
            return await Room.findOneAndUpdate({_id: id}, {
                $push: {
                    images: files
                }
            }, {
                new: true
            })
                .then((field) => {
                    if (field) {
                        return res.json({
                            error: false,
                            message: "Successfully! uploaded photo!",
                            data: field
                        })
                    } else {
                        return res.json({
                            error: true,
                            message: "Some Error",
                            data: null
                        })
                    }
                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: err.message,
                        data: null
                    })
                })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }

    })

    route.patch('/:id', new RoomController().update)

    //new RoomController().updateImages

    route.delete("/delete/photo/:id/:image_id", async (req, res) => {
        try {
            const findit = await Room.findOne({
                "images": {
                    $elemMatch:
                        {
                            _id: req.params.image_id
                        }
                }
            }).select('images.path images.filename images._id')
                .then((result) => {
                    result = result?._doc ?? result
                    let pathFile = []
                    if (Array.isArray(result?.images) && result?.images.length > 0) {

                        for (let i = 0; i < result.images.length; i++) {
                            result.images[i] = result.images[i]?._doc ?? result.images[i]
                            if (result.images[i]._id.toString() === req.params.image_id) {
                                pathFile.push({
                                    path: result.images[i].path,
                                    filename: result.images[i].filename,
                                })
                            }
                        }
                    }
                    if (Array.isArray(pathFile) && pathFile.length > 0) {
                        console.log({paths: clearPath(first(pathFile)?.path, first(pathFile)?.filename)})
                        GetThumbnailPath(clearPath(first(pathFile)?.path, first(pathFile)?.filename))
                    }
                    return first(pathFile)
                })
                .catch(err => {
                    return null
                })
            console.log({findit})
            return await Room.findOneAndUpdate({_id: req.params.id}, {
                $pull: {
                    images: {
                        "_id": req.params?.image_id
                    }
                }
            }, {new: true})
                .then((field) => {
                    if (field) {
                        return res.json({
                            error: false,
                            message: `Successfully! deleted image ${req?.params?.image_id}`,
                            data: field
                        })
                    } else {
                        return res.json({
                            error: false,
                            message: 'Data not found!',
                            data: null
                        })

                    }
                })
                .catch((err) => {
                    return res.json({
                        error: false,
                        message: err.message,
                        data: null
                    })
                })

        } catch (err) {
            return res.json({
                error: false,
                message: err.message,
                data: null
            })
        }

    })

    route.get('/lists', new RoomController().getRooms)

    route.put('/update/schedule', new RoomController().putSchedule)


    route.put("/update/:id/foto", new RoomController().updateImages)
    // return app
}
