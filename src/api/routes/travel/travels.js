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
import Pagination from "../../../lib/utils/Pagination";

const route = Router()

export default (app) => {
    app.use('/', route)

    route.get('/likes', MixedMiddlewares.protectLogin[0], async (req, res, next) => {
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
    })

    /**
     * [ CREATE TRAVEL ]
     * @url {{END_POINT}}/travel/create
     *
     */
    route.post('/create', MixedMiddlewares.protectLogin[0], TravelService.create)

    route.put('/update', MixedMiddlewares.protectLogin[0], TravelService.update)

    route.get('/all', async (req, res, next) => {
        try {
            const [err, travel] = await TravelService.all(req.query)
            if (err) throw YuyuidError.internal('error get travel ')
            return res.status(200).json({error: false, message: "get Successfully", success: true, data: travel})

        } catch (e) {
            throw next(e)
        }
    })

    route.get('/list', TravelService._getTravelLists)

    route.get('/:id', async (req, res, next) => {
        try {

            const {id} = req.params
            await Travel.findById({_id: id})
                .then(async (field) => {
                    const likes = await TravelLikes.findOne({travel: field.id}).select("-__v -_id -travel -date").populate('likes.user', ['firstName', 'avatar', 'lastName', 'email', 'is_verify'])
                    const discuss = await TravelDiscuss.findOne({travel: field.id}).select("-__v -_id -travel -date").populate('discuss.user', ['firstName', 'avatar', 'lastName', 'email', 'is_verify'])

                    if (field) {
                        await Travel.findOneAndUpdate({_id: id}, {$set: {seen: field.seen + 1},}, {new: true})
                        return res.json({
                            error: false,
                            message: "Successfully!",
                            data: field,
                            likes: typeof (likes?.likes) !== "undefined" ? likes.likes : [],
                            discuss: typeof (discuss?.discuss) !== "undefined" ? discuss?.discuss : []
                        }).status(200)
                    } else {
                        return res.json({
                            error: true,
                            message: `Travel ${id} not found!`,
                            data: null,
                            likes: [],
                            discuss: []
                        }).status(200)
                    }


                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: err.message,
                        data: null,
                        likes: [],
                        discuss: []
                    }).status(200)
                })


        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null,
                likes: [],
                discuss: []
            }).status(500)
        }
    })


    route.put('/likes/:id', isAuth, async (req, res) => {
        try {

            const {user} = req.body
            const {id} = req.params

            const travel = await TravelLikes.findOne({travel: id}).populate("likes.user", ["email", "firstName", "lastName"])

            if (travel) {
                //Check if post has already been liked by user
                if (
                    travel.likes.filter(like => like.user?._id.toString() === user).length > 0
                ) {
                    return res
                        .status(200)
                        .json({
                            error: true,
                            message: "Already liked by this user",
                            data: travel
                        });
                }
                travel.likes.unshift({user})
                //puts it on the beginning
                // room.wishList.unshift({user: req.user.id});
                // await room.save();

                await travel.save()
                // res.json(room.wishList);


                return res.json({
                    error: false,
                    message: "halloooo",
                    data: travel
                })
            } else {
                const getTravel = await Travel.findById({_id: id})
                if (getTravel) {
                    const newTravel = await new TravelLikes({
                        travel: id
                    }).save()

                    newTravel.likes.unshift({user})
                    //newTravel it on the beginning
                    // room.wishList.unshift({user: req.user.id});
                    // await room.save();

                    await newTravel.save()
                    // res.json(room.wishList);


                    return res.json({
                        error: false,
                        message: "newTravel",
                        data: newTravel
                    }).status(200)
                    // return res
                    //     .status(200)
                    //     .json({
                    //         error: true,
                    //         message: `Travel ${id} not found!`,
                    //         data: newTravel
                    //     });
                } else {
                    return res
                        .status(200)
                        .json({
                            error: true,
                            message: `Travel ${id} not found!`,
                            data: null
                        });
                }


            }

        } catch (err) {

            return res
                .status(500)
                .json({
                    error: true,
                    message: err.message,
                    data: null
                });
        }
    })

}
