import { Router } from 'express'
import {AuthValidator} from "../../lib/validator";
import {AuthService} from "@yuyuid/services";
import {Profile, UpRole, User, Villa} from "@yuyuid/models";
import {PermissionsService} from "../../services/permissions.service";
import ActivationService from "../../services/activation.service";
import {isAuth} from "../middlewares/auth";
import {BodyResponse} from "@handler";


const route = Router()

export default (app)=> {
    app.use('/auth', route)

    /**
     * LOAD USER
     */
    route.get('/loaduser',isAuth, async (req,res)=> {
        try{
            const user = await User.findById(req.user.id).select("-password");
            console.log({user})

            if (user){
                if(typeof(user?.role) !== "undefined"){
                    switch (user?.role){
                        case "admin":
                        case "customer":
                            return await Profile.findOne({ user: user.id })
                                .populate("user", ["name","role", "avatar","email","firstName","lastName","username","avatar"])
                                .then((field)=> {
                                    if(field){
                                        return res.json(new BodyResponse({
                                            error:false,
                                            message: "Successfully!",
                                            data: field
                                        })).status(200)
                                    }else{
                                        return res.json(new BodyResponse({
                                            error:true,
                                            message: "profile not found!",
                                            data: null
                                        })).status(200)
                                    }
                                })
                                .catch((err)=> {
                                    return res.json(new BodyResponse({
                                        error:true,
                                        message: err.message,
                                        data: null
                                    })).status(500)
                                })
                        case "villa":
                            return await Villa.findOne({user:user.id})
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

                                .then((field)=> {
                                    if(field){
                                        return res.json(new BodyResponse({
                                            error:false,
                                            message: "Successfully!",
                                            data: field
                                        })).status(200)
                                    }else{
                                        return res.json(new BodyResponse({
                                            error:true,
                                            message: "profile not found!",
                                            data: null
                                        })).status(200)
                                    }
                                })
                                .catch((err)=> {
                                    return res.json(new BodyResponse({
                                        error:true,
                                        message: err.message,
                                        data: null
                                    })).status(500)
                                })
                        default:
                            return res.json(new BodyResponse({
                                error:true,
                                message: "Role not found!",
                                data: null
                            })).status(500)
                    }
                }
            }
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                data: null
            })).status(500)
        }
    })


    /**
     * SIGN UP
     */
    route.post("/signup", AuthValidator.signupValidator, async (req, res, next) => {
        try {

            const newUser = await AuthService.SignUp(req);
            // const roles = await PermissionsService.FindRolesByName(newUser.user.role)
            // await AuthService.RolesPermissions(newUser.user._id,roles.id)

            return res.json({ message: "Register successfully", ...newUser }).status(201);
        } catch (e) {
            return next(e);
        }
    });

    /**
     * SIGN IN
     */
    route.post("/signin", AuthValidator.signinValidator, async (req, res, next) => {
        try {
            const newUser = await AuthService.SignIn(req.body);
            return res.json({
                error: false,
                status:"success",
                message: "Sign successfully", data: {...newUser} }).status(200);
        } catch (e) {
            return res.json({
                status:"error",
                message: e.message}).status(400);
        }
    });

    /**
     * verify email
     */
    route.get("/verify/email/:token", async (req,res)=>{
        try{
            let { token } = req.params

            // let {token} = req.paA
            //  await ActivationService.VerifyEmail(token)
            const {error,message,data} = await ActivationService.VerifyEmail(token)
            console.log({error,message,data})
            return res.json({error,message,data}).status(200)
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null,
            }).status(500)
        }
    });

    /**
     * FORGOT PASSWORD
     */
    route.post("/forgot/password", AuthService.forgotPassword)

    /**
     * CHANGE PASSWORD
     */
    route.post('/change/password',isAuth, AuthValidator.changePasswordValidator,AuthService.ChangePassword)

    /**
     * DELETE USER BY ID
     */
    route.delete("/user/delete/:id", isAuth, AuthService.deleteUser)
}
