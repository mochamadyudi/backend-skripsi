import {User} from "@yuyuid/models";

export default class AuthControllerV2{
    async _signUp(req,res){
        try{

            await User.create({})
            return res.json({
                error:false,
                message: "successfully!"
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message
            })
        }
    }
}
