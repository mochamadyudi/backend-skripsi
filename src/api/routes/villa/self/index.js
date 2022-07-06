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



const route = Router();
export default ()=> {
    const app = Router();
    app.use("/",isAuth,isVillas,route)
    // app.use(isAuth);

    Rooms(app)

    route.get('/profile', async (req,res)=> {
        try{
            let user = req.user
            const villa = await Villa.findOne({user: user?.id})
                .populate("user", ["name","role", "avatar","email","firstName","lastName","username","avatar"])
                .populate({
                    path:"likes",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select:["likes"]
                })
                .populate({
                    path:"discuss",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path:"rates",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select:["rates"]
                })
                .populate("user",["email","avatar","firstName","lastName","username"])
                .populate("locations.provinces",["name","id",'latitude','longitude','alt_name'])
                .populate("locations.districts",["name","id",'regency_id','latitude','longitude','alt_name'])
                .populate("locations.sub_districts",["name","id",'district_id','latitude','longitude'])
                .populate("locations.regencies",["name","id",'province_id','latitude','longitude','alt_name'])
                .select("name social _id villa_type slug bio thumbnail description videos photos locations")
                .exec()

            return res.json({
                error:false,
                message: "success",
                data: villa
            })

        }catch(err){
            return res.json({
                error:true,
                message:err.message
            }).status(500)
        }
    })




    route.put("/profile/update",async (req,res)=> {
        try{
            let {id} = req.user
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


    // route.put('/profile/thumbnail', VillaService._putThumbnail)

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

    // route.put('/update/thumbnail', uploadFileMiddleware, VillaService._putThumbnail)
    //
    // route.put('/photos/add', uploadFileMiddleware, VillaService._addPhotos)
    // route.delete('/photos/:id', uploadFileMiddleware, VillaService._deletePhoto)

    return app;
}
