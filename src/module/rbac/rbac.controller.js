import {_MRBAC} from "./index";
import YuyuidError from "@yuyuid/exception";
import {BodyResponse} from "@handler";
import RbacService from "./rbac.service";
import {ObjResolve} from "@yuyuid/utils";

export default class RbacController{

    async roleCreate(req,res){
        try{
            const [ err ,data ] = await new RbacService({
                fields: req.body
            })._roleCreate()

            if(err) {
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    message: err?.message ?? "Bad Request",
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                    ...err,
                    status:500,
                    message: err?.message ?? "Exception Failed",
                }))
        }
    }
    async roleList(req,res){
        try{
            const [ err , data ] = await new RbacService({
                query: req.query,
                req
            })._roleList();

            if(err) return  res.json(YuyuidError.badRequest(new Error(err?.message ?? "Bad Request")));

            res.status(200);
            return res.json(new BodyResponse({
                ...data
            }))
        }catch(err){
            throw YuyuidError.expectationFailed(new Error(err?.message))
        }
    }
    async roleDelete(req,res){
        try{
            const [ err , data ] = await new RbacService({
                id: req.params.id,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            })._roleDestroy();

            if(err) return  res.json(YuyuidError.badRequest(new Error(err?.message ?? "Bad Request")));

            res.status(200);
            return res.json(new BodyResponse({
                ...data
            }))
        }catch(err){
            throw YuyuidError.expectationFailed(new Error(err?.message))
        }
    }
    async roleDetail(req,res){
        try{
            const [ err ,data ] = await new RbacService({
                fields: req.body,
                id: req.params.id,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            })._roleDetail()

            if(err) {
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    message: err?.message ?? "Bad Request",
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                ...err,
                status:500,
                message: err?.message ?? "Exception Failed",
            }))
        }
    }
}