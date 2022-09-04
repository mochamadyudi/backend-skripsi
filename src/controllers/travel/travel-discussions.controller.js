import TravelDiscusService from "../../services/travel/travel-discus.service";
import {BodyResponse} from "@handler";
import YuyuidError from "@yuyuid/exception";

export default class TravelDiscussionsController {
    async getAll(req,res){
        try{

        }catch(err){
            return res.json({
                error:true,
                message: err?.message ?? "Some Error",
                data:[]
            })
        }
    }

    async _getAllByTravel(req,res){
        try{
            let {id} = req.params
            const [err, data] = await new TravelDiscusService({
                id:id,
                query: req.query
            }).get()
            console.log(err)

            if(err) throw YuyuidError.badData(err)

            return res.json(new BodyResponse({
                error:false,
                message:"Successfully!",
                data:data
            }))
        }catch(err){
            return res.json({
                error:true,
                message: err?.message ?? "Some Error",
                data:[]
            })
        }
    }

    async _add(req,res){
        try{
            let { id } = req.params
            Reflect.set(req.body,"user",req.user.id)
            Reflect.set(req.body,"travel",id)

            const [err, data] = await new TravelDiscusService({
                fields:req.body
            }).add()

            if(err) throw YuyuidError.badData(err)

            return res.json(new BodyResponse({
                error:false,
                message:"Successfully!",
                data
            }))
        }catch(err){
            return res.json({
                error:true,
                message: err?.message ?? "Some Error",
                data:[]
            })
        }
    }

    async _updateComment(req,res){
        try{

        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                data:null
            }))
        }
    }


}
