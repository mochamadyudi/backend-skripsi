import {BodyResponse} from "@handler";
import __ConfRooms from "./index";
import {ObjResolve} from "@yuyuid/utils";

export default class TmpConfirmRoomsController {
    constructor(props = {}) {
        this.version = props?.version ?? 1
    }

    async get(req,res){
        try{
            const [ err,data ] = await new __ConfRooms.Module({
                query:req.query,
                isVilla: true,
                user: req.user,
                req
            }).list()


            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    error:true,
                    message: err?.message ?? err ?? "Some Error",
                    ...data
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                ...data
            }))

        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data:null
            }))
        }
    }
    async update(req,res){
        try{
            const [ err,data ] = await new __ConfRooms.Module({
                isVilla: true,
                user: req.user,
                fields:req.body,
                id:ObjResolve(req.params,'id') ?? ObjResolve(req.query,'id') ?? null,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id",
                req
            }).update()

            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    error:true,
                    message: err?.message ?? err ?? "Some Error",
                    ...data
                }))
            }


            res.status(200)
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data: data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null
            }))
        }
    }



    async #_v2Get(){}
}