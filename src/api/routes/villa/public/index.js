import {Router} from "express";
import Pagination from "../../../../lib/utils/Pagination";
import {Villa, Travel, User} from "@yuyuid/models";
import moment from "moment";
import VillaService from "../../../../services/villa.service";
import {ObjResolve,ToBoolean} from "@yuyuid/utils";
import mongoose from "mongoose";
import VillaController from "../../../../controllers/villa.controller";
import {CheckAuth, isAuth} from "../../../middlewares/auth";

const route = Router()
export default (app) => {
    app.use('/', route)
    route.get('/profile', async (req, res) => {
        return res.json({error: false, message: "oK!"})
    })

    route.get("/search/:q", async (req, res) => {
        try {
            let {q} = req.params

            const {page, limit, direction} = Pagination(req.query)


            const villa = await Villa.find({name: {$regex: '.*' + q + '.*'}, $options: 'i'})
                .limit(limit)
                .skip(limit * (page > 1 ? page : 0))
                .populate("user", ["name", "role", "avatar", "email", "firstName", "lastName", "username", "avatar"])
                .populate({
                    path: "likes",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["likes"]
                })
                .populate({
                    path: "discuss",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path: "rates",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["rates"]
                })
                .populate("user", ["email", "avatar", "firstName", "lastName", "username"])
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])
                .select("name social _id villa_type slug bio thumbnail description videos photos locations")
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
            const count = await Villa.find({name: {$regex: '.*' + q + '.*'}, $options: 'i'}).count()

            return await res.json({
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
                },
                data: villa
            }).status(200)


        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500);
        }
    })

    route.get("/detail/slug/:slug", async (req, res) => {
        try {

            let {slug} = req.params
            const villa = await Villa.findOne({slug})
                .populate({
                    path: "likes",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["likes"]
                })
                .populate({
                    path: "discuss",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path: "rates",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["rates"]
                })
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])
            // .select("name social _id villa_type slug bio thumbnail description videos photos locations")

            if (villa) {
                return res.json({
                    error: false,
                    message: null,
                    data: villa,
                })
            } else {
                return res.json({
                    error: false,
                    message: "Villa not found!",
                    data: null
                })
            }
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.get('/promotion', VillaService.getVillaPromotion)

    route.get('/list', VillaService.getVilla)

    route.get('/list-detail', async (req, res) => {
        try {

            let {query, params} = req
            const {page, limit, direction} = Pagination(query)

            let condition = [
                {
                    $lookup:{
                        from:"users",
                        foreignField:"_id",
                        localField: "likes.user",
                        as:"likes"
                    }
                },
                {
                    $lookup:{
                        from:"rooms",
                        foreignField:"villa",
                        localField: "_id",
                        as:"rooms"
                    }
                },
                {
                    $lookup:{
                        from:"location_districts",
                        foreignField:"_id",
                        localField: "locations.districts",
                        as:"locations.districts"
                    }
                },
                {
                    $unwind: {
                        path: "$locations.districts",
                        preserveNullAndEmptyArrays:true
                    }
                },
                {
                    $unwind: {
                        path: "$rooms",
                        preserveNullAndEmptyArrays:true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        rooms: {$push: "$rooms"},
                        data: { $push: '$$ROOT' }
                    }
                },
                {
                    $set:{
                        data: {$arrayElemAt: ["$data",0]}
                    }
                },
                {
                    $set:{
                        "locations.districts": {$arrayElemAt:["$locations.districts",0]}
                    }
                },
            ]

            let projected  = {
                $project: {
                    total_likes:{$size:'$data.likes'},
                    'data.bio':1,
                    'data.createdAt':1,
                    'data.description':1,
                    'data.facility':1,
                    'data.is_deleted':1,
                    'data.is_published':1,
                    'data.is_update':1,
                    'data.locations':1,
                    'data.name':1,
                    'data.social':1,
                    'data.photos':1,
                    'data.seen':1,
                    'data.slug':1,
                    'data.thumbnail':1,
                    'data.user':1,
                    'data.videos':1,
                    'data.villa_type':1,
                    'data.website':1,
                    'data.contact':1,
                    'data.likes._id':1,
                    'data.likes.email':1,
                    'data.likes.avatar':1,
                    'data.likes.firstName':1,
                    'data.likes.lastName':1,
                    'data.likes.is_verify':1,
                }
            }
            let roomPage = ObjResolve(query,"roomPage") ? parseInt(ObjResolve(query,"roomPage")) : 0
            let roomLimit = ObjResolve(query,"roomLimit") ? parseInt(ObjResolve(query,"roomLimit")) : 10

            if(ObjResolve(query,'withRooms') && ToBoolean(ObjResolve(query,'withRooms')) === true){
                Reflect.set(projected['$project'],"total_rooms", {$size:"$rooms"})
                Reflect.set(projected['$project'],"rooms", {$slice: ["$rooms",roomPage,roomLimit]})
            }

            condition.push(projected)


            const count = await Villa.count()

            let NewData= []
            const data = await Villa.aggregate(condition)
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })

            if(Array.isArray(data) && data.length > 0) {
                for(let i =0; i < data.length;i++) {
                    data[i] = data[i]?._doc ?? data[i]
                    data[i] = {
                        ...data[i]?.data,
                        ...data[i],
                    }
                    if(ObjResolve(query,'withRooms') && ToBoolean(ObjResolve(query,'withRooms')) === true){

                    }else{
                        Reflect.deleteProperty(data[i],'rooms')
                    }
                    Reflect.deleteProperty(data[i],'data')
                    NewData.push({
                        ...data[i]
                    })
                }
            }
            return res.json({
                error: false,
                message: "successFully!",
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
                data: NewData
            })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: []
            })
        }
    })

    route.get("/detail/:id", async (req, res) => {
        try {
            CheckAuth(req)
            let {id} = req.params
            let likes = {
                limit: 2,
                page: 1,
            }
            if (ObjResolve(req.query, "likes") && ObjResolve(ObjResolve(req.query, "likes"), "page")) {
                Reflect.set(likes, "page", parseInt(ObjResolve(ObjResolve(req.query, "likes"), "page")))
            }
            if (ObjResolve(req.query, "likes") && ObjResolve(ObjResolve(req.query, "likes"), "limit")) {
                Reflect.set(likes, "limit", parseInt(ObjResolve(ObjResolve(req.query, "likes"), "limit")))
            }

            let countLikes = await new VillaController().getCountLikes(id)

            let villa = await Villa.findOne({_id: id}).select("-__v")
                // .populate({
                //     path: "user",
                //     select: ["name", "role", "avatar", "email", "firstName", "lastName", "username", "avatar"].join(" "),
                //     populate: {
                //         path: "user-profiles"
                //     }
                //
                // })
                .populate({
                    path: "likes",
                    select: "email role firstName lastName avatar",
                    // populate:{
                    //     path:"villa-profiles"
                    // },
                    options: {
                        limit: likes.limit,
                        sort: {date: -1},
                        skip: (likes.limit * (likes.page > 1 ? likes.page : 0))
                    }
                })
                // .populate({
                //     path: "discuss",
                //     options: {
                //         limit: 10,
                //         sort: {date: -1},
                //         skip: 0
                //     },
                //     select: ["discuss"]
                // })
                // .populate({
                //     path: "rates",
                //     options: {
                //         limit: 10,
                //         sort: {date: -1},
                //         skip: 0
                //     },
                //     select: ["rates"]
                // })
                .populate("user", ["email", "avatar", "firstName", "lastName", "username"])
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])
                // .select("name social _id villa_type slug bio thumbnail description videos photos locations")
            villa = villa?._doc ?? villa

            if (villa) {

                let isLike = false
                console.log(villa.likes, req.user)
                let a = Array.isArray(villa.likes) && villa.likes.filter((item) => item?._id === req.user.id)
                console.log(a)
                return res.json({
                    error: false,
                    message: null,
                    likes: {
                        ...likes,
                        total: countLikes
                    },
                    data: {
                        ...villa,
                        isLikes: isLike,
                        created_at: moment(villa.date, "YYYY MM DD").format("YYYY MMMM DD LTS")
                    }
                })
            } else {
                return res.json({
                    error: false,
                    message: "Villa not found!",
                    data: null
                })
            }
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    route.get("/detail/:id/likes", VillaService.getLikes)
    route.get('/list/near-me', async (req, res) => {
        try {
            await Travel.find({
                locations: {
                    $near: {
                        $geometry: {
                            lat: req.body.lat,
                            lng: req.body.lng
                        },
                        $maxDistance: 5000
                    }
                }
            }).exec((err, travel) => {
                if (err) {
                    console.log(err)
                }
                if (travel) {
                    console.log(travel)
                }
            })
        } catch (err) {

        }
    })

    route.get('/rooms/:id', new VillaController().getRoomInVilla)
}
