import {Router} from "express";
import {isAuth,isVillas} from "../../../middlewares/auth";
import {Villa} from "../../../../models/villa/villa.schema";
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";
import Pagination from "../../../../lib/utils/Pagination";


export default ()=> {
    const app = Router();
    app.use(isAuth);
    app.use(isVillas)

    app.get('/profile', async (req,res)=> {
        try{
            let user = req.user
            const villa = await Villa.findOne({user: user?.id})
                .populate("user",["email","avatar","firstName","lastName","username"])
                .select("name social _id villa_type slug bio thumbnail description videos photos")
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


    app.put("/profile/update", async (req,res)=> {
        try{

        }catch(err){
            throw err;
        }
    })


    /**
     * admin scope
     */
    app.get("/all", async (req,res)=> {
        try{
            const villa = await Villa.find().sort({ date: -1 });
            return await res.json(villa).status(200);
        }catch(err){
            return res.json({error:true,message:err.message}).status(500)
        }
    })

    return app;
}
