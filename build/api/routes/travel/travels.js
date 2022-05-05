import { Router } from 'express';
import { TravelService, UserService } from "@yuyuid/services";
import { YuyuidConfig } from "@yuyuid/config";
import YuyuidError from "@yuyuid/exception";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import BodyResponse from "../../../lib/handler/body-response";
import { Travel } from "@yuyuid/models";
import { MixedMiddlewares } from "@yuyuid/middlewares";

const route = Router();

export default (app => {
    app.use('/', route);

    route.get('/likes', MixedMiddlewares.protectLogin[0], async (req, res, next) => {
        try {
            const token = await UserService.GetToken(req);
            const data = await UserService.UserLoaded(req.user.id);
            // return res.json({
            //     message:"User has been found",
            //     success: true,
            //
            //     data:{
            //         token,
            //         ...data,
            //     }
            // }).status(200);
            return res.json({ message: "Create Successfully", data: req.body }).status(200);
        } catch (e) {
            return next(e);
        }
    });

    /**
     * [ CREATE TRAVEL ]
     * @url {{END_POINT}}/travel/create
     *
     */
    route.post('/create', MixedMiddlewares.protectLogin[0], TravelService.create);

    route.put('/update', MixedMiddlewares.protectLogin[0], TravelService.update);

    route.get('/all', async (req, res, next) => {
        try {
            const [err, travel] = await TravelService.all(req.query);
            if (err) throw YuyuidError.internal('error get travel ');
            return res.status(200).json({ error: false, message: "get Successfully", success: true, data: travel });
        } catch (e) {
            throw next(e);
        }
    });

    route.get('/:id', MixedMiddlewares.protectLogin[0], async (req, res, next) => {
        try {
            const { error, data, message } = await TravelService.single(req.params);

            if (error) throw YuyuidError.internal('failed get travel');
            const likes = await TravelService.getLikes(data.id);
            const discuss = await TravelService.getDiscuss(data.id);

            return res.json({
                message: "success",
                data: {
                    travel: data,
                    likes: likes.likes ? likes.likes : [],
                    discuss: discuss.discuss ? discuss.discuss : []
                }
            }).status(200);
        } catch (err) {
            return next(err);
        }
    });
});
//# sourceMappingURL=travels.js.map