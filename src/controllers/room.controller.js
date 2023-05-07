import {BodyResponse} from "@handler";
import {Room, Villa} from "@yuyuid/models";
import {RoomSchedule} from "../models/rooms/room_schedule.schema";
import formidable from "formidable";
import {generatePublic, uploadFile} from "../lib/modules/google-apis";
import ImagesChecker from "../lib/utils/images-checker";
import {changeFileName, clearPath, GetThumbnailPath, ObjResolve, pathUploadedByDate, ToBoolean} from "@yuyuid/utils";
import mv from "mv";
import Pagination from "../lib/utils/Pagination";
import RoomLib from "../services/lib/room.lib";
import RoomsService from "../services/rooms.service";
import YuyuidError from "@yuyuid/exception";
import TmpConfirmRoomsService from "../module/__tmp/confirm-rooms/tmp-confirm-rooms.service";

export default class RoomController {


    async create(req, res) {
        try {
            let body = req.body
            let user = req.user

            return await new RoomController().createRoom(body, {
                villa: user?.profile?.id ?? null,
                user: user?.id ?? user?._id ?? null,
            }).then(async ({error, data, status}) => {
                if (!error) {
                    return res.json(new BodyResponse({
                        status:status,
                        error:false,
                        message: "Successfully created!",
                        data:data
                    })).status(status)
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

            let id = req.user.id
            if (ObjResolve(req.query,"id")) {
                id = ObjResolve(req.query,"id")
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
        try{

            const [err, data] = await new RoomsService({body:req.body,id:req.params.id,orderBy:"_id"})._patch()
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data:data
            }))
        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err?.message ?? "Some error",
                data:null
            }))
        }
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
        try{
            const id = req.params.id
            await Room.findOneAndRemove({_id:id})
                .then(async (row)=> {
                    if(row){
                        if(ObjResolve(row,'images')){
                            if(Array.isArray(ObjResolve(row,'images')) && ObjResolve(row,'images').length > 0){
                                let images = ObjResolve(row,'images')
                                for(let i = 0 ; i < images.length ; i ++){
                                    console.log(clearPath(images[i]?.prefix_url,images[i]?.filename),`CLEAR PATH ${i}`)
                                    await GetThumbnailPath(clearPath(images[i]?.prefix_url,images[i]?.filename))
                                }
                            }
                        }
                    }

                    return res.json(new BodyResponse({
                        status:200,
                        error:false,
                        message: "Successfully",
                        data: row
                    }))
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        ...err,
                        status:500,
                        error: true,
                        message : err?.message ?? "Some Error",
                        data: null
                    }))
                })

        }catch(err){
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error: true,
                message : err?.message ?? "Some Error",
                data: null
            }))
        }
    }

    async get(req, res) {

    }


    async createRoom(fields, other) {
        try {

            const room = await new Room({
                ...fields,
                ...other
            })
            console.log({room})

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
                .populate({
                    path:"villa",
                    select: ["name", "thumbnail", "website", "social", "contact", "locations", "seen",'photos','videos'].join(" "),
                    populate:[
                        {
                            path:"locations.districts",
                        },
                        {
                            path:"locations.provinces",
                        },
                        {
                            path:"locations.regencies",
                        },
                        {
                            path:"locations.sub_districts",
                        },

                    ]
                })
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
            let select = ['name','facility','is_available','status','seen','is_deleted','_id','schedule','images','createdAt','updatedAt','price'].join(' ')
            if(ObjResolve(options.query,"select")){
                select = ObjResolve(options.query,"select")
            }
            let populate = []

            if(ObjResolve(options.query,"withVilla") && ToBoolean(ObjResolve(options.query,"withVilla")) === true){
                populate.push({
                    path:"villa",
                    select:ObjResolve(options.query,"villaSelect") ?? ["thumbnail","social","contact","slug","name","rates","id"],
                })
            }
            const {page, direction, limit} = Pagination(options.query)
            const count = await Room.find({user:id}).count()
            return await Room.find({user:id})
                .select(select)
                .populate(populate)
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


    async _getPublicRooms(req,res){
        try{
            const [err, data ] = await new RoomsService({
                query: req.query
            })._list()
            if(err) throw YuyuidError.badData(err)
            return res.json({
                status:200,
                error:false,
                message: "Successfully!",
                ...data
            })
        }catch(err){
            res.status(500)
            return res.json({
                status:500,
                error:true,
                message: err.message,
                data: []
            })
        }
    }


    async _deleteImages(req,res){
        try{

        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err?.message ?? "Some error",
                data: null
            }))
        }
    }



    async _singleRoom(req,res){
        try{
            const data = await new RoomController().getRoomById(req.params.id)

            if(data){
                if(!ObjResolve(req.query,'withoutCount')){
                    await new TmpConfirmRoomsService({
                        options: {
                            new:true,
                        },
                        schema: Room,
                        orderBy: "_id",
                        id: req.params.id,
                        fields: {
                            $inc: {
                                seen: 1
                            }
                        }
                    }).update()
                }else{
                    if(ObjResolve(req.query,'withoutCount') === "false"){
                        await new TmpConfirmRoomsService({
                            options: {
                                new:true,
                            },
                            schema: Room,
                            orderBy: "_id",
                            id: req.params.id,
                            fields: {
                                $inc: {
                                    seen: 1
                                }
                            }
                        }).update()
                    }
                }
            }
            return res.json(new BodyResponse({
                status:data ? 200 : 404,
                error:!data,
                message: data ? "successfully!": "Data not found",
                data:data
            }))
        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                ...err,
                message: err.message,
                data:null
            }))
        }
    }
}
