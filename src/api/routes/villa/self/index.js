import {Router} from "express";
import {isAuth,isVillas} from "../../../middlewares/auth";
import {Villa} from "@yuyuid/models";
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";
import Pagination from "../../../../lib/utils/Pagination";
import {BodyResponse} from "@handler";
import VillaService from "../../../../services/villa.service";
import Rooms from './rooms'
import {uploadFileMiddleware} from "../../../../lib/modules/uploaded";
import ResizeModule from "../../../../lib/modules/resize.module";
import VillaController from "../../../../controllers/villa.controller";



const route = Router();
export default ()=> {
    const app = Router();
    app.use("/",isAuth,route)
    // app.use(isAuth);
    //isVillas

    Rooms(app)

    route.get('/profile', new VillaController().MyProfile)
    route.put('/update/thumbnail', uploadFileMiddleware, VillaService._putThumbnail)
    route.put('/profile/photo', uploadFileMiddleware, VillaService._addPhotos)
    route.delete('/profile/photo/:imageId', VillaService._putThumbnail)

    route.post('/create', new VillaController()._create)

    route.put("/profile/update",async (req,res)=> {
        try{
            let {id} = req.user
            console.log({user:req.user})
            return await Villa.findOne({user:id})
                .then(async (field)=> {
                    if (field){
                        const {error,data,message} = await VillaService.updateVilla(field.id, {...req.body})

                        if(!error){
                            return res.json(new BodyResponse({
                                error,
                                message,
                                data
                            })).status(200)
                        }
                    }else{
                        return res.json(new BodyResponse({
                            error:true,
                            message: `Villa Not found`,
                        })).status(200)
                    }
                })


        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
            })).status(500)
        }
    })
    route.patch("/profile",new VillaController()._villaUpdate)


    route.get('/likes/:id', new VillaController()._createLikes)

    route.put('/profile/thumbnail', VillaService._putThumbnail)

    /**
     * admin scope
     */
    // route.get("/all", async (req,res)=> {
    //     try{
    //         const villa = await Villa.find().sort({ date: -1 });
    //         return res.json(villa).status(200);
    //     }catch(err){
    //         return res.json({error:true,message:err.message}).status(500)
    //     }
    // })


    //
    // route.put('/photos/add', uploadFileMiddleware, VillaService._addPhotos)
    // route.delete('/photos/:id', uploadFileMiddleware, VillaService._deletePhoto)

    return app;
}
