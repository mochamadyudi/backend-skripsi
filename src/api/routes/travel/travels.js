import {Router} from 'express'
import {TravelService, UserService} from "@yuyuid/services";
import {YuyuidConfig} from "@yuyuid/config";
import YuyuidError from "@yuyuid/exception";

const route = Router()

export default (app) => {
    app.use('/', route)

    route.get('/likes', async (req, res, next) => {
        try {
            // const token = await UserService.GetToken(req)
            // const data = await UserService.UserLoaded(req.user.id)
            // return res.json({
            //     message:"User has been found",
            //     success: true,
            //
            //     data:{
            //         token,
            //         ...data,
            //     }
            // }).status(200);
            return res.json({message: "Create Successfully", ...req.body}).status(200)
        } catch (e) {
            return next(e)
        }
    })

    route.post('/create', async (req, res, next) => {
        try {
            const [err, travel] = await TravelService.create(req.body)

            if (err) throw YuyuidError.internal('travel cant`t be created.');
            const [errLikes,likes] = await TravelService.firstCreatLikes(travel.id)
            const [errDiscuss,discuss] = await TravelService.firstCreateDiscuss(travel.id)

            if (errLikes) throw YuyuidError.internal('initial Likes cant`t be created.');
            if (errDiscuss) throw YuyuidError.internal('initial Discuss cant`t be created.');

            return res.json({
                message: "Create Successfully",
                data: {
                    id: travel.id,
                    travel_name: travel?.travel_name,
                    price: travel?.price,
                    travel_detail: travel?.travel_detail,
                    discuss: discuss.discuss,
                    likes: likes.likes
                }
            }).status(200)

        } catch (e) {
            console.log(e)
            throw next(e)
        }
    })

    route.get('/all', async (req,res,next)=> {
        try{
            const [err, travel] = await TravelService.all(req.query)

            // console.log(travel)
            if (err) throw YuyuidError.internal('error get travel ')
            return res.json({
                message: "get Successfully",
                ...travel
            }).status(200)
        }catch(e){
            throw next(e)
        }
    })

    route.get('/:id', async (req,res,next)=> {
        try{
            const [err,travel] = await TravelService.single(req.params)

            if (err) throw YuyuidError.internal('failed get travel')
            const likes = await TravelService.getLikes(travel.id)
            const discuss = await TravelService.getDiscuss(travel.id)


            return res.json({message: "success",
                data : {
                    travel,
                    likes: likes.likes,
                    discuss: discuss.discuss
                }}).status(200)
        }catch(err){
            return next(err)
        }
    })



}
