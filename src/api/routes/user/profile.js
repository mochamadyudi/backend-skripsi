import { Router } from 'express'
import {UserService} from "@yuyuid/services";

const route = Router()

export default (app)=> {
    app.use('/',route)

    route.get('/profile' , async (req,res,next)=> {
        try{
            const token = await UserService.GetToken(req)
            const data = await UserService.UserLoaded(req.user.id)
            return res.json({
                message:"User has been found",
                success: true,

                data:{
                    token,
                    ...data,
                }
            }).status(200);
        }catch(e){
            return next(e)
        }
    })
}
