import BodyResponse from "../lib/handler/body-response";
import {User, Villa, VillaLikes} from "@yuyuid/models";
import Pagination from "../lib/utils/Pagination";
import VillaService from "../services/villa.service";
import {ObjArr, ObjResolve, OptParams, StrToArr} from "@yuyuid/utils";
import YuyuidError from "@yuyuid/exception";
import mongoose from "mongoose";
import first from 'lodash'
import RoomsService from "../services/rooms.service";

export default class VillaController {

    /**
     *
     * @param id
     * @param options
     * @returns {Promise<BodyResponse>}
     * @private
     */
    async _get(id = null, options = {query: {}, params: {}}) {
        try {
            if (id === null) {
                let {query} = options
                const {page, direction, limit} = Pagination(options.query)
                let condition = {}
                if (ObjResolve(query, "notIn")) {
                    OptParams.villaNotIn(condition, '_id', ObjResolve(query, "notIn"))
                }


                const count = await Villa.find(condition).count()
                return await Villa.find(condition)
                    .limit(limit)
                    .skip(limit * (page > 1 ? page - 1 : 0))
                    .sort({
                        date: direction === "desc" ? -1 : 1
                    })
                    .populate({
                        path:"locations.provinces",
                        select:"-_id name alt_name latitude longitude"
                    })
                    .populate({
                        path:"locations.regencies",
                        select:"-_id name alt_name latitude longitude"
                    })
                    .populate({
                        path:"locations.districts",
                        select:"-_id name alt_name latitude longitude"
                    })
                    .populate({
                        path:"locations.sub_districts",
                        select:"-_id"
                    })
                    .populate({
                        path: "rates",
                        select: "rates"
                    })
                    .populate({
                        path: "user"
                    })
                    .populate({
                        path: "discuss",
                        select: "discuss"
                    })
                    .then((fields) => {
                        if (fields) {
                            if (Array.isArray(fields) && fields.length > 0) {
                                for (let i = 0; i < fields.length; i++) {
                                    fields[i] = fields[i]?._doc ?? fields[i]

                                    if (ObjResolve(fields[i], "rates")) {
                                        let rate = ObjResolve(ObjResolve(fields[i], "rates"), "rates")
                                        Reflect.set(fields[i], "rates", rate)
                                    }
                                    if (ObjResolve(fields[i], "likes")) {
                                        let likes = ObjResolve(ObjResolve(fields[i], "likes"), "likes")
                                        Reflect.set(fields[i], "likes", likes)
                                    }
                                    if (ObjResolve(fields[i], "discuss")) {
                                        let discuss = ObjResolve(ObjResolve(fields[i], "discuss"), "discuss")
                                        Reflect.set(fields[i], "discuss", discuss)
                                    }


                                }
                            }
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

                    })

            } else {
                return await Villa.findById({_id: id})
                    .then((field) => {
                        if (field) {
                            return new BodyResponse({
                                error: false,
                                message: "Successfully!",
                                data: field
                            })
                        } else {
                            return new BodyResponse({
                                error: false,
                                message: `Villa ${id} not found!`,
                                data: null
                            })
                        }
                    })
            }
        } catch (err) {
            return new BodyResponse({error: true, message: err.message})
        }
    }

    async _getLikes(id, query = {}) {
        try {
            const {page, direction, limit} = Pagination(query)

            let options = {
                limit: limit,
                sort: {
                    date: direction === "desc" ? -1 : 1
                },
                skip: limit * (page > 1 ? page - 1 : 0)
            }

            if (ObjResolve(query, "orderBy")) {
                Reflect.set(
                    options.sort,
                    ObjResolve(query, "orderBy") ?? "date",
                    direction === "desc" ? -1 : 1
                )
            }
            let count = await Villa.count({_id: id})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .populate({
                    path: "likes",
                    options: options,
                    select: "likes"
                })

            return await Villa.find({_id: id})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .populate('likes.user')
                // .populate({
                //     path: "likes.user",
                //     options: options,
                //     select: "user",
                //     // populate:{
                //     //     path:"user"
                //     // }
                // })
                .then((result) => {
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
                        data: result
                    })
                })
                .catch((err) => {

                })

        } catch (err) {
            return new BodyResponse({
                error: true,
                message: err.message,
                data: []
            })
        }
    }

    async _createLikes(req, res) {
        try {
            let {id} = req.params
            return await Villa.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $addToSet: {
                        likes: [
                            {
                                user:req.user.id
                            }
                        ]
                    }
                },
                {new: true, rawResult: true}
            )
                .then((result) => {
                    return res.json(new BodyResponse({
                        error: false,
                        message: "successfully!",
                        data: result,
                    }))
                })
                .catch((err) => {
                    return res.json(new BodyResponse({
                        error: true,
                        message: err.message,
                        data: null
                    }))
                })
            // return await Villa.findOne({_id: id})
            //     .populate({
            //         path:"likes",
            //         // match: {
            //         //     likes: req.user.id
            //         // },
            //     })
            //     .then(async ({_doc}) => {
            //         let result = _doc
            //         // return res.json(new BodyResponse({
            //         //     error: true,
            //         //     message: null,
            //         //     data: result
            //         // }))
            //         await VillaLikes.findOneAndUpdate(
            //             {
            //                 _id: result?.likes?._id
            //             },
            //             {
            //                 $push: {
            //                         likes: [req.user.id
            //                         ]
            //                     }
            //             },{new:true,rawResult:true}
            //         )
            //             .populate("likes")
            //             .then((rows)=> {
            //                 // Reflect.set(result,"likes",rows)
            //                 return res.json(new BodyResponse({
            //                     error: true,
            //                     message: null,
            //                     data: rows,
            //                     result,
            //                 }))
            //             })
            //             .catch((err)=> {
            //                 return res.json(new BodyResponse({
            //                     error: true,
            //                     message: err.message,
            //                     data: null
            //                 }))
            //             })
            //
            //
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //         return res.json(new BodyResponse({
            //             error: true,
            //             message: err.message,
            //             data: null
            //         }))
            //     })

        } catch (err) {
            return res.json(new BodyResponse({
                error: true,
                message: err.message,
                data: null
            }))
        }
    }


    async getCountLikes(id) {
        try {
            return await Villa.aggregate(
                [{
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                }, {
                    $project: {
                        likes: {
                            $size: '$likes'
                        }
                    }
                }])
                .then((val) => {
                    let newArr = []
                    if (Array.isArray(val)) {

                        for (let i = 0; i < val.length; i++) {
                            val[i] = val[i]?._doc ?? val[i]
                            if (typeof (val[i]?.likes) !== "undefined") {
                                newArr.push(val[i]?.likes)
                            }
                        }
                    }
                    return newArr.reduce((a, b) => {
                        return a + b
                    }, 0)
                })
                .catch((err)=> {
                    return 0
                })
        } catch (err) {
            return 0
        }
    }

    async _create(req, res) {
        try {
            let {body, user} = req
            const [err, villaCheck] = await VillaService.checkVillaFoundByUser(user.id)
            if (err) throw YuyuidError.badData(err)
            if (!villaCheck) {
                Reflect.set(body, 'user', user.id)
                let villa = await VillaService.createVilla(body)
                return res.json({
                    error: false,
                    message: "Successfully!",
                    data: villa
                })
            }
            return res.json({
                error: true,
                message: "Some Error",
                data: villaCheck
            })
        } catch (err) {
            return [err, null]
        }
    }


    /**
     * @access - [ villa ]
     */
    async _villaUpdate(req,res){
        try{
            console.log({user:req.user})
            const [err,data ] = await new VillaService({
                fields:req.body,
                id:req.user.id,
                orderBy:"user"
            }).updateProfile()

            if(err) throw YuyuidError.internal(first(err?.errors)?.message ?? "Some Error")

            res.status(200)
            return res.json(new BodyResponse({
                error:false,
                message : "Successfully!",
                data: data
            }))

        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data:null
            }))
        }
    }

    async MyProfile(req,res){
        try{
            const [err,data] = await new VillaService({
                orderBy:"user",
                id:req.user.id
            }).MyProfile()

            if(err) throw YuyuidError.internal(first(err?.errors)?.message ?? "Some error")
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data:data
            }))
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message ?? "Some error",
                data:null
            }))
        }
    }

    async getRoomInVilla(req,res){
        try{
            Reflect.set(req.query,'villaIn',[req.params.id])

            const [err, data ] = await new RoomsService({query:req.query})._list()

            if(err) throw YuyuidError.badData(first(err?.errors)?.message ?? err ?? "Some Error")


            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data,
            }))
        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err?.message ?? "-"
            }))
        }
    }
}
