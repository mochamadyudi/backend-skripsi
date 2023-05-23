import {YidException} from "@handler";
import {AuthService} from "@yuyuid/services";

export default class AuthController {
    async _signUp(req,res){
        try{
            const [ err , data ] = await new AuthService({
                fields: req.body
            }).signUpAdmin()

            if(err){
                return YidException.BadReq(res,err)
            }
            return YidException.Success(res,{
                message:"Successfully",
                data
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    }

    async signUpAdmin(req,res){
        try{
            const [ err , data ] = await new AuthService({
                fields: req.body
            }).signUpAdmin()

            if(err){
                return YidException.BadReq(res,err)
            }
            return YidException.Success(res,{
                message:"Successfully",
                data
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    }
    async signUpVilla(req,res){
        try{
            const [ err , data ] = await new AuthService({
                fields: req.body
            }).signUpAdmin()

            if(err){
                return YidException.BadReq(res,err)
            }
            return YidException.Success(res,{
                message:"Successfully",
                data
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    }
}
