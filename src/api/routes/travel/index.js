import { Router } from 'express'
import travels from './travels'
import category from './category'
import {TravelService} from "@yuyuid/services";
import {MixedMiddlewares} from "@yuyuid/middlewares";
import TravelController from "../../../controllers/travel.controller";
import YuyuidError from "@yuyuid/exception";
import Pagination from "../../../lib/utils/Pagination";
import {Travel} from "@yuyuid/models";
import BodyResponse from "../../../lib/handler/body-response";
import {isAuth} from "../../middlewares/auth";
import {ObjResolve} from "@yuyuid/utils";
import DiscussionRoute from './discussions'


const route = Router()
export default ()=> {
    const app = Router();
    app.use("/",route)
    // app.use(isAuth);

    app.use('/discussion',DiscussionRoute())
    // RouteUser(app)


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

    route.get('/list/near-me', new TravelController()._nearMe)
    route.post('/list/near-me', async (req, res) => {
        try {
            const {page, limit, direction} = Pagination(req.query)
            let condition = []
            let find = {
                locations: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates:[
                                req.body.lng,
                                req.body.lat
                            ]
                        },
                        $maxDistance: req.body?.max ?? 5000
                    }
                }

            }

            if(ObjResolve(req.query,'notIn')){
                Reflect.set(find,"_id", {
                    $nin: ObjResolve(req.query,'notIn') ?? []
                })
            }

            await Travel.find({...find})
                .populate("categories",['-about'])
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

    app.use('/category',category())
    route.put('/likes/:id', isAuth, TravelService._addLikes)

    route.get('/show/:keyword', TravelService.single)
    return app;
}
