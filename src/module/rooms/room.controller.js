import {_MRoom} from "./index";
import YuyuidError from "@yuyuid/exception";
import {BodyResponse} from "@handler";
import {ObjResolve} from "@yuyuid/utils";

export default class RoomController {
    async create(req,res){
        try{
            const [err , data ] = await new _MRoom.Module({
                fields:req.body
            }).create()

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
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null
            })
        }
    }

    async list(req,res){
        try{
            const [ err , data ] = await  new _MRoom.Module({
                query: req.query,
                req:req,
            }).list()

            return res.json(new BodyResponse({
                ...data,
            })).status(200);
        }catch(err){
            return res.json(new BodyResponse({
                ...err,
            })).status(500)
        }
    }
    async uploadImage(req,res){
        try{

            return res.json({
                req: req.files ?? req.file
            })
        }catch(err){
            res.json(500)
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error"
            }))
        }
    }
    async detail(req,res){
        try{
            let { id } = req.params
            const [ err , data ] = await  new _MRoom.Module({
                query: req.query,
                req:req,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id",
                id: id
            }).detail()
            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    error: true,
                    message: err?.message
                }))
            }
            if(!data) {
                res.status(404);
                return res.json(new BodyResponse({
                    error:false,
                    data: null,
                    status:404,
                    message: "User not found!"
                }))
            }
            return res.json(new BodyResponse({
                data,
            })).status(200);
        }catch(err){
            return res.json(new BodyResponse({
                ...err,
            })).status(500)
        }
    }
    async delete(req,res){
        try{
            let { id } = req.params
            const [ err , data ] = await  new _MRoom.Module({
                id: id
            }).delete()
            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    error: true,
                    message: err?.message
                }))
            }
            if(!data) {
                res.status(404);
                return res.json(new BodyResponse({
                    error:false,
                    data: null,
                    status:404,
                    message: "User not found!"
                }))
            }
            return res.json(new BodyResponse({
                data,
            })).status(200);
        }catch(err){
            return res.json(new BodyResponse({
                ...err,
            })).status(500)
        }
    }
}