import {BodyResponse} from "@handler";

export default class NotificationsController {
    async _pushBook(req,res){
        try{
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data: null
            }))
        }catch(err){
            res.json(err?.response?.status)
            return res.json({
                ...err?.response,
                error:true,
                message: err?.message ?? "Some Error",
                data: null
            })
        }
    }
}