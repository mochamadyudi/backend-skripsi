import {UserService} from "@yuyuid/services";

export default class TravelController {

    async Likes (req,res,next){
        try {
            const token = await UserService.GetToken(req)
            const data = await UserService.UserLoaded(req.user.id)
            return res.json({
                message: "User has been found",
                success: true,

                data: {
                    token,
                    ...data,
                }
            }).status(200);
            // return res.json({message: "Create Successfully", data:req.body}).status(200)
        } catch (e) {
            return next(e)
        }
    }
}
