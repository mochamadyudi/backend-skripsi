import {_MOrder} from "./index";
import YuyuidError from "@yuyuid/exception";

export default class OrderController {
    async create(req,res){
        try{
            const [err , data ] = await new _MOrder.Module({
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
}