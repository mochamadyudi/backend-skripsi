import {Router} from "express";
import {User} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {isAdmins} from "../../../middlewares/auth";
import {Villa} from "@yuyuid/models";
import {BodyResponse} from "@handler";
import {DeleteObjKey, ObjResolve, OptParams} from "@yuyuid/utils";


const route = Router()

export default (app) => {
    app.use('/villa', route)

    app.use(isAdmins)

    route.delete("/delete/:id", async (req, res) => {
        try {

            const {id} = req.params
            await User.findOneAndRemove({id})

            return res.json({
                error: false,
                message: `Successfully! deleted Account ID ${id}`,
            }).status(200)

            // return res.json({
            //     error:;
            // })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.put('/publish/:id', async (req, res) => {
            try {
                let {id} = req.params

                return await Villa.findOneAndUpdate(
                    {_id: id},
                    {
                        $set: {
                            is_published:true
                        }
                    },{
                        rawResult:false,
                    }
                ).then((response)=> {
                    return res.json(new BodyResponse({
                        error:false,
                        message: "Successfully!",
                        data: response
                    }))
                })
                    .catch((err)=> {
                        return res.json(new BodyResponse().error({message:err.message,status:500})).status(500)
                    })
            } catch
                (err) {
                return res.json(new BodyResponse().error({message: err.message, status: 500})).status(500)
            }
        })

    route.get('/list', async (req, res) => {
        try {
            let {query} = req
            let obj = {}


            if (typeof (req.query?.is_new) !== "undefined") {
                if (req.query.is_new === "1") {
                    Reflect.set(obj, "updated_at", {
                        $exists: true
                    })
                } else {
                    Reflect.set(obj, "updated_at", {
                        $exists: true,
                        $ne: true
                    })
                }
            } else {
                Reflect.set(obj, "updated_at", {
                    $exists: true
                })
            }

            if (typeof (query?.is_published) !== "undefined") {
                let isPublished = []
                try {
                    if (query?.is_published !== "") {
                        isPublished = JSON.parse(query?.is_published) ?? [true, false]
                    }
                } catch (err) {
                    isPublished = [true, false]
                }
                Reflect.set(obj, "is_published", {
                    $in: isPublished
                })
            }

            const {page, limit, direction} = Pagination(query)


            const count = await Villa.find({...obj}).count()

            return await Villa.find({...obj},null,{rawResult:true,safe: true}).limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .populate({
                    path: 'rates',select:['rates.rates']})
                .populate("likes")
                .populate("discuss")
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .exec(function(err, docs) {
                    if(err){
                        return res.json(err).status(500)
                    }
                    let data = []

                    if(Array.isArray(docs) && docs?.length > 0){
                        for(let i=0; i < docs?.length ;i++){
                            let item = docs[i]?._doc
                            if(ObjResolve(item,'rates')){
                                if(ObjResolve(item?.rates,'rates')){
                                    Reflect.set(item,'rates',ObjResolve(item?.rates,'rates'))
                                }
                            }
                            if(ObjResolve(item,'discuss')){
                                if(ObjResolve(item?.discuss,'discuss')){
                                    Reflect.set(item,'discuss',ObjResolve(item?.discuss,'discuss'))
                                }
                            }
                            if(ObjResolve(item,'likes')){
                                if(ObjResolve(item?.likes,'likes')){
                                    Reflect.set(item,'likes',ObjResolve(item?.likes,'likes'))
                                }
                            }

                            data.push(item)
                        }
                    }
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
                        data: data
                    })
                })
                // .catch((err)=> {
                //     return res.json({
                //         error: true,
                //         message: err.message,
                //         data: null
                //     }).status(500)
                // })


            // return res.json({
            //     error:;
            // })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.get('/search', async (req,res)=> {
        try{
            let { query } = req
            let options = {}

            OptParams.name(query,options)
            OptParams.slug(query,options)
            OptParams.website(query,options)
            OptParams.Seen(query,options)
            OptParams.isPublished(query,options)
            OptParams.isUpdate(query,options)
            OptParams.isDeleted(query,options)

            const {page, limit, direction} = Pagination(query)


            const count = await Villa.find({...options}).count()

            return await Villa.find({...options})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .populate({
                    path: 'rates',select:['rates.rates']})
                .populate("likes")
                .populate("discuss")
                .sort({
                    date: direction === "desc" ? -1 : direction === "asc" ? 1: 0
                })
                .exec(function(err, docs) {
                    if(err){
                        return res.json(err).status(500)
                    }
                    let data = []

                    if(Array.isArray(docs) && docs?.length > 0){
                        for(let i=0; i < docs?.length ;i++){
                            let item = docs[i]?._doc
                            if(ObjResolve(item,'rates')){
                                if(ObjResolve(item?.rates,'rates')){
                                    Reflect.set(item,'rates',ObjResolve(item?.rates,'rates'))
                                }
                            }
                            if(ObjResolve(item,'discuss')){
                                if(ObjResolve(item?.discuss,'discuss')){
                                    Reflect.set(item,'discuss',ObjResolve(item?.discuss,'discuss'))
                                }
                            }
                            if(ObjResolve(item,'likes')){
                                if(ObjResolve(item?.likes,'likes')){
                                    Reflect.set(item,'likes',ObjResolve(item?.likes,'likes'))
                                }
                            }

                            data.push(item)
                        }
                    }
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
                        data: data
                    })
                })
        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err.message
            })).status(500)
        }
    })

}
