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

const route = Router()

export default (app) => {
    app.use('/', route)

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

    route.get('/:id', TravelService.single)


    route.put('/likes/:id', isAuth,TravelService._addLikes)

}
