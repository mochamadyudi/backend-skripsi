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
import TravelController from "../../../controllers/travel.controller";
import category from './category'
import {ObjResolve} from "@yuyuid/utils";
import {ObjectId} from "mongodb";
const route = Router()

export default (app) => {
    app.use('/', route)

    route.get('/:keyword', TravelService.single)

    route.get('/likes', MixedMiddlewares.protectLogin[0], new TravelController().Likes)

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

    route.post('/list/near-me', async (req, res) => {
        try {
            const {page, limit, direction} = Pagination(req.query)
            let find = {
                // locations: {
                //     "$near": {
                //         "$geometry": {
                //             type: "Point",
                //             coordinates:[
                //                 req.body.lng,
                //                 req.body.lat
                //             ]
                //         },
                //         "$maxDistance": req.body?.max ?? 5000
                //     }
                // }
            }

            if(ObjResolve(req.query,'notIn')){
                find = {
                    ...find,
                    _id:{
                        $nin: new ObjectId(req.query.notIn)
                    }
                }
                // Reflect.set(find,'_id',{
                //     $nin:ObjResolve(req.query,'notIn')
                // })
            }
            await Travel.find({...find})
                .populate("categories.category", ['slug', 'name', 'is_verify', 'is_published'])
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .exec((err, travel) => {
                if (err) {
                    return res.json(new BodyResponse({
                        error:true,
                        message: err.message,
                        query: {
                            limit,
                            page: page > 0 ? page : 1,
                            direction,
                        },
                        pagination: {
                            total_page: limit > 0 ? Math.ceil(0 / limit) : 1,
                            current_page: page > 0 ? page : 1,
                            total_record: 0,
                        },
                        data: null
                    })).status(500)
                }
                if (travel) {
                    return res.json(new BodyResponse({
                        error:false,
                        message: "Successfully!",
                        query: {
                            limit,
                            page: page > 0 ? page : 1,
                            direction,
                        },
                        pagination: {
                            total_page: limit > 0 ? Math.ceil(travel.length / limit) : 1,
                            current_page: page > 0 ? page : 1,
                            total_record: travel.length,
                        },
                        data: travel
                    })).status(200)
                }
            })
        } catch (err) {

        }
    })


    route.put('/likes/:id', isAuth, TravelService._addLikes)


}
