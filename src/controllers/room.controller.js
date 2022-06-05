import {BodyResponse} from "@handler";
import {Room, Villa} from "@yuyuid/models";
import {RoomSchedule} from "../models/rooms/room_schedule.schema";
import formidable from "formidable";
import {generatePublic, uploadFile} from "../lib/modules/google-apis";
import ImagesChecker from "../lib/utils/images-checker";
import {changeFileName, pathUploadedByDate} from "@yuyuid/utils";
import mv from "mv";
import Pagination from "../lib/utils/Pagination";
import RoomLib from "../services/lib/room.lib";

export default class RoomController {


    async create(req, res) {
        try {
            let body = req.body
            let user = req.user
            const villa = await Villa.findOne({user: user?.id})
            const {schedule_id} = await new RoomController().createInitialSchedule()

            if (schedule_id) {
                await new RoomController().createRoom(body, {
                    villa: villa?.id ?? villa?._id ?? null,
                    user: user?.id ?? user?._id ?? null,
                    schedule: schedule_id,
                }).then(async ({error, data, status}) => {
                    if (!error) {
                        await new RoomController().updateRefRoomsSchedule(schedule_id, data?._id)
                        return res.json(data).status(status)
                    } else {
                        return res.json(new BodyResponse({
                            error: true,
                            message: "undefined",
                            data: null,
                        }))
                    }
                })
                    .catch((err) => {
                        return res.json(new BodyResponse({
                            error: true,
                            message: err?.message,
                            data: null,
                        }))
                    })
                // if (typeof(rooms) !== "undefined"){
                //     if (!rooms?.error) {
                //         await new RoomController().updateRefRoomsSchedule(schedule_id, rooms?.data?._id)
                //     }
                //     return res.json(rooms).status(rooms?.status)
                // }
                // return res.json(new BodyResponse({
                //     error:true,
                //     message: "undefined",
                //     data:null,
                // }))
            }


        } catch (err) {
            return res.json(new BodyResponse({
                error: true,
                status: 500,
                message: err.message,
            })).status(500)
        }
    }

    async getRooms(req, res) {
        try {
            let id = null
            if (typeof (req.body?.id) !== "undefined") {
                id = req.body.id
            }

            return await new RoomController()._getListsRooms(id, {query: req.query, params: req.params})
                .then((result) => {
                    return res.json({...result}).status(500)
                })
                .catch((err) => {
                    return res.json(new BodyResponse({
                        error: true,
                        message: err.message,
                        status: 500
                    })).status(500)
                })
        } catch (err) {
            return res.json(new BodyResponse({
                error: true,
                message: err.message,
                status: 500
            })).status(500)
        }
    }

    async putSchedule(req, res) {
        try {
            let {id} = req.body
            const roomSchedule = await RoomSchedule.findOne({
                _id: id,
            })
            if (roomSchedule) {
                for (let i = 0; i < req.body.data.length; i++) {
                    // await roomSchedule.user.unshift(req.body?.user_id)
                    await roomSchedule.schedule.unshift({
                        ...req.body.data[i]
                    })
                }

                await roomSchedule.save()

                return res.json(new BodyResponse({
                    error: false,
                    data: roomSchedule
                }))

            }
        } catch (err) {
            return res.json(new BodyResponse({
                error: true,
                message: err.message,
                status: 500
            })).status(500)
        }
    }


    async update(req, res) {

    }

    async updateImages(req, res) {
        try {


            const form = new formidable.IncomingForm()
            await form.parse(req, async function (err, fields, files) {
                // let {file} = files
                // var oldpath = file.filepath;

                console.log(Object.keys(files).length)

                if(typeof(files) !== "undefined" && typeof(files) === "object" && Object.keys(files).length > 0){

                }

                // const {extension, status} = await ImagesChecker.mimeType(files.thumbnail.mimetype)
                // if (status) {
                //     let filename = changeFileName(files.thumbnail.originalFilename.toString().toLowerCase().replace(/ /g, "_"), extension)
                //     const {prefix_date, path_full, only_date} = pathUploadedByDate(filename)
                //
                //     // console.log(dates.join("/"))
                //     mv(oldpath, path_full, function (err) {
                //         if (err) throw err;
                //     })
                //
                //     // return res.json({
                //     //     error:false,
                //     //     message:"successfully!",
                //     //     data:path_full,
                //     //     prefix_date
                //     // })
                //
                //     // im.identify(['-format', '%wx%h', filePath], function(err, output){
                //     //     if (err) throw err;
                //     //     console.log('dimension: '+output);
                //     //     // dimension: 3904x2622
                //     // });
                //     // const thumbnailInfo = await thumbnail({
                //     //     src: filePath,
                //     //     width: 100,
                //     //     height: 100,
                //     // });
                //     // console.log({thumbnailInfo})
                //     await Villa.findOneAndUpdate(
                //         {user: req.user.id},
                //         {
                //             $set: {
                //                 thumbnail: {
                //                     prefix: `${process.env.PREFIX_URL}/public/uploads`,
                //                     url: `${prefix_date}/${filename}`
                //                 }
                //             }
                //         },
                //         {new: true})
                //         .then((field) => {
                //             if (field) {
                //                 return res.json(
                //                     new BodyResponse({
                //                         error: true,
                //                         message: "Successfully!",
                //                         status: 200,
                //                         data: field,
                //                         only_date
                //                     })
                //                 ).status(200)
                //             } else {
                //                 return res.json(
                //                     new BodyResponse({
                //                         error: true,
                //                         message: "Not found!",
                //                         status: 200,
                //                         data: null
                //                     })
                //                 ).status(200)
                //             }
                //         })
                //         .catch((err) => {
                //             return res.json(
                //                 new BodyResponse({
                //                     error: true,
                //                     message: err.message,
                //                     status: 500,
                //                     data: null
                //                 })
                //             ).status(500)
                //         })
                // }
            });
            return res.json(new BodyResponse({
                error: false,
                message: null,
                status: 200
            })).status(200)
        } catch (err) {
            return res.json(new BodyResponse({
                error: true,
                message: err.message,
                status: 500
            })).status(500)
        }
    }

    async delete(req, res) {

    }

    async get(req, res) {

    }


    async createRoom(fields, other) {
        try {

            // console.log({fields,other})
            const room = await new Room({
                ...fields,
                ...other
            })

            // console.log(room)
            if (room) {
                await room.save();
                console.log({room})
                const getRooms = await new RoomController().getRoomById(room?._id ?? room?.id ?? null)
                return {
                    error: false,
                    data: room,
                    message: "Success",
                    status: 200
                }
            } else {
                return {
                    error: false,
                    data: null,
                    message: "Some Error in Server",
                    status: 200
                }
            }

        } catch (err) {
            return {
                error: true,
                data: null,
                message: err?.message ?? "Some Error in server",
                status: 500
            }
        }
    }

    async getRoomById(id) {
        try {
            return await Room.findOne({_id: id})
                .populate("schedule", ["schedule"])
                .populate("villa", ["name", "thumbnail", "website", "social", "contact", "location", "seen"])
                .then((field) => {
                    if (field) {
                        return field
                    } else {
                        return null
                    }
                })
                .catch((err) => {
                    return null
                })
        } catch (err) {
            return null
        }
    }

    async createInitialSchedule() {
        try {
            const Schedule = await new RoomSchedule()
            await Schedule.save();
            return {
                schedule_id: Schedule.id
            }
        } catch (err) {
            return {
                ...err,
                error: true,
                schedule_id: null
            }
        }
    }

    async updateRefRoomsSchedule(schedule_id, id) {
        const schedule = await RoomSchedule.findOneAndUpdate({
            id: id,

        }, {$set: {rooms: schedule_id},}, {new: true})
        await schedule.save();
    }


    async _getSingleScheduleById(id, callback = () => {
    }) {

        try {
            return await RoomSchedule.findOne({_id: id},)
                .then((field) => {
                    if (field) {
                        return callback(new BodyResponse({
                            error: false,
                            data: field
                        }))
                    } else {
                        return callback(new BodyResponse({
                            error: false,
                            data: null
                        }))
                    }
                })
                .catch((err) => {
                    return callback(new BodyResponse({
                        error: true,
                        message: err.message,
                        data: null,
                    }))
                })
        } catch (err) {
            return callback(new BodyResponse({
                error: true,
                message: err.message,
                data: null,
            }))
        }
    }

    async _getListsRooms(id = null, options = {query: {}, params: {}}) {
        try {
            const {page, direction, limit} = Pagination(options.query)
            const count = await Room.find().count()
            return await Room.find().populate('schedule', ['createdAt', 'updatedAt', 'schedule'])
                .populate('images._id',['filename','path','prefix_url','originalname'])

                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })

                .then((fields) => {
                    if (fields) {
                        let newData=  []
                        return new BodyResponse({
                            error: false,
                            message: "successfully!",
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
                            data: fields
                        })
                    } else {
                        return new BodyResponse({
                            error: false,
                            message: "Data Not found!",
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
                            data: []
                        })
                    }
                })

                .catch((err) => {
                    return new BodyResponse({
                        error: true,
                        message: err.message ?? "Data Not found!",
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
                        data: []
                    })
                })

        } catch (err) {
            return new BodyResponse({
                error: true,
                message: err.message,
                status: 500,
                data: null,
            })
        }
    }

}
