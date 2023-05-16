import YuyuidError from "@yuyuid/exception";
import {_MVilla} from "@Modules";
import {ObjResolve} from "@yuyuid/utils";
import {BodyResponse} from "@handler";

export default class VillaController{
    constructor() {
    }

    async _detailVila(req,res){
        try{
            const [ err, data] = await new _MVilla.Service({
                query:req.query,
                id: ObjResolve(req.query,'id') ?? ObjResolve(req.params,'id') ?? null,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            })._detailVilla()
            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    error:true,
                    status:400,
                    message: err?.message ?? "Some Error",
                    data: null
                }))
            }
            if(!data){
                res.status(404)
                return res.json(new BodyResponse({
                    status:404,
                    error:true,
                    message: "Data Not Found!",
                    data: null
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                error:false,
                message: "Successfully data found!",
                status:200,
                data: data,
            }))
        }catch(err){
            res.status(500)
            return res.json(YuyuidError.expectationFailed(err?.message))
        }
    }

    async list(req,res){
        try{
            const [ err, data ] =await new _MVilla.Service({
                query:req.query,
                id:ObjResolve(req.query,'villaId') ?? ObjResolve(req.params,'villaId') ?? null,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            }).list()
            if(err) throw YuyuidError.badRequest(err)
            res.status(!data?404:200)
            return res.json({
                ...err,
                status:!data?400:200,
                error:false,
                message: "Successfully!",
                data: data
            })
        }catch(err){
            res.status(500)
            return res.json({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null,
            })
        }
    }
    async _detailPage(req,res){
        try{
            const [ err, data ] =await new _MVilla.Service({
                query:req.query,
                id:ObjResolve(req.query,'villaId') ?? ObjResolve(req.params,'villaId') ?? null,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            })._PageDetail()
            if(err){
                res.status(400)
                return res.json({
                    ...err,
                    status:400,
                    error:true,
                    message: err?.message ?? "Some Error",
                    data: null,

                })
            }
            if(!data){
                res.status(404)
                return res.json({
                    status:404,
                    error:true,
                    message: "Data not found!",
                    data:null
                })
            }
            res.status(200)
            return res.json({
                error:false,
                status:200,
                message: "Successfully!",
                data
            })
        }catch(err){
            res.status(500)
            return res.json({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null,

            })
        }
    }
    async _detailTransaction(req,res){
        try{
            const [ err ,data ] = await new _MVilla.Service({
                query:req.query,
                id: ObjResolve(req.query,'villaId') ?? ObjResolve(req.params,'villaId') ?? null,
                orderBy: ObjResolve(req.query,'orderBy') ?? "villa._id"
            })._Transaction()
            res.status(200)
            return res.json(new BodyResponse({
                ...err,
                status:200,
                error:false,
                message: "Successfully!",
                data: data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                ...err,
                error:true,
                message: err?.message ?? "Some Error",
                status:500,data:null
            }))
        }
    }
}