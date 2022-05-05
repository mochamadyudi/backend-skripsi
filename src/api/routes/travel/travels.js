import {Router} from 'express'
import {TravelService, UserService} from "@yuyuid/services";
import {YuyuidConfig} from "@yuyuid/config";
import YuyuidError from "@yuyuid/exception";
import formidable from "formidable";
import {v2 as cloudinary} from "cloudinary";
import BodyResponse from "../../../lib/handler/body-response";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import {MixedMiddlewares} from "@yuyuid/middlewares";
import {TravelLikes} from "../../../models/travel/travel_likes.schema";
import {isAuth} from "../../middlewares/auth";

const route = Router()

export default (app) => {
    app.use('/', route)

    route.get('/likes', MixedMiddlewares.protectLogin[0], async (req, res, next) => {
        try {
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
            // return res.json({message: "Create Successfully", data:req.body}).status(200)
        } catch (e) {
            return next(e)
        }
    })

    /**
     * [ CREATE TRAVEL ]
     * @url {{END_POINT}}/travel/create
     *
     */
    route.post('/create', MixedMiddlewares.protectLogin[0],  TravelService.create)

    route.put('/update', MixedMiddlewares.protectLogin[0], TravelService.update)

    route.get('/all', async (req, res, next) => {
        try {
            const [err, travel] = await TravelService.all(req.query)
            if (err) throw YuyuidError.internal('error get travel ')
            return res.status(200).json({error:false,message: "get Successfully",success:true,data:travel})

        } catch (e) {
            throw next(e)
        }
    })

    route.get('/:id', async (req, res, next) => {
        try {

            const {id} = req.params

            await Travel.findOne({
                _id:id
            })
                .then(async (field)=> {
                    if (field){
                        const likes = await TravelLikes.findOne({travel:field.id}).select("-__v -_id -travel -date").populate('likes.user', ['firstName','lastName','email','is_verify'])
                        const discuss= await TravelDiscuss.findOne({travel:field.id}).select("-__v -_id -travel -date").populate('discuss.user', ['firstName','lastName','email','is_verify'])

                        return res.json({
                            error:false,
                            message: "Successfully!",
                            data: {
                                row: field,
                                likes:typeof(likes?.likes) !== "undefined" ? likes.likes : [],
                                discuss: typeof(discuss?.discuss) !== "undefined" ? discuss?.discuss : []
                            }
                        }).status(200)
                    }else{
                        return res.json({
                            error:true,
                            message: `Travel ${id} not found!`,
                            data: null
                        }).status(200)
                    }
                })
                .catch((err)=> {
                    return res.json({
                        error:true,
                        message: err.message,
                        data: null
                    }).status(200)
                })

        } catch (err) {
            return next(err)
        }
    })


    route.put('/likes/:id', isAuth, async (req,res)=> {
        try{
            // const {user} = req.body
            // const {id} = req.params

            return res.json({
                error:false,
                message: "halloooo",
                data: null
            })
            console.log()
        }catch(err){

        }
    })

}
