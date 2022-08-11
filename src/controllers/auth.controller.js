export default class AuthController {
    async _signUp(req,res){
        try{

        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    }
}
