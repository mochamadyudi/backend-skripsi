import { Router } from 'express'
import {UserService} from "@yuyuid/services";
import formidable  from 'formidable';

const cloudinary = require('cloudinary').v2
import BodyResponse from "../../../lib/handler/body-response";

const route = Router()

export default (app)=> {
    app.use('/',route)

    route.get('/profile' , async (req,res,next)=> {
        try{
            const token = await UserService.GetToken(req)
            const {user,profile} = await UserService.UserLoaded(req.user.id)
            return res.json({
                message:"User has been found",
                success: true,
                data:{
                    token,
                    user,
                    profile
                }
            }).status(200);
        }catch(e){
            return next(e)
        }
    })

    route.put('/profile/avatar', async (req,res,next)=> {
        try{
            const  form = new formidable.IncomingForm();
            return await form.parse(req, async function (err, fields, files) {
                await cloudinary.uploader.upload(files.file.filepath, {
                    upload_preset: "default-preset-aku",
                    categorization: "google_tagging",
                    auto_tagging: 0.6
                }, (error, result) => {

                    return res.status(200)
                        .json(new BodyResponse({data: result}))
                });
            });
        }catch(e){
            return res.status(500).json({error:true,message:e.message})
        }
        // return res.json({...req.body})
    })

    route.put('/profile/update', async (req,res,next)=>{
        try{
            await UserService.updateProfile({id:req.user.id,data:req.body})
                .then((response)=> {
                    return res.status(response.status ? response.status : 200).json(response)
                })
                .catch((err)=> {
                    return res.status(500).json(new BodyResponse({error:true,status:500,message:err.message}))
                })


        }catch(e){
            return res.status(500).json(new BodyResponse({error:true,message:e.message}))
        }
    })

}
