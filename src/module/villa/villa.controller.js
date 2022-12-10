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
    async _detailTransaction(req,res){
        try{
            res.status(200)
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data: null
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