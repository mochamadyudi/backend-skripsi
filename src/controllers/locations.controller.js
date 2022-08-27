import {BodyResponse} from "@handler";
import {Districts, Regencies} from "@yuyuid/models";

export default class LocationsController {
    async getDistrictsKarawang(req,res){
        try{
            let karawang = await Regencies.findOne({name:/karawang/i})
            console.log(karawang)
            if(karawang){
                return await Districts.find({regency_id:karawang.id})
                    .then((result)=> {
                        return res.json(new BodyResponse({
                            error:false,
                            message: "successfully!",
                            data:result
                        }))
                    })
                    .catch((err)=> {
                        return res.json(new BodyResponse({
                            error:true,
                            message: err.message,
                            data : []
                        }))
                    })
            }
            return res.json(new BodyResponse({
                error:false,
                message: "Not Found!",
                data : []
            }))
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                data : []
            }))
        }
    }






}
