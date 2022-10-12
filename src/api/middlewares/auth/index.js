import verifyCurrentUser from './verifyCurrentUser'
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";
import {BodyResponse} from "@handler";

const isAuth = async (req, res, next) => {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            req.user = user
            next();
        }else{
            res.status(401).json(new BodyResponse({message: "unAuthorization!",error:true,status:401}));
        }
    } catch (err) {
        res.status(401).json(new BodyResponse({message: "unAuthorization!",error:true,status:401}));
    }
}

export const CheckAuth = async(req) => {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            Reflect.set(req,"user",user)

        }else{
            Reflect.set(req,"user", null)
        }
    } catch (err) {
        Reflect.set(req,"user", null)
    }
}
const isAdmins = async (req,res,next)=> {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            if(user.role === "admin"){
                req.user = user
                next();
            }else{
                res.json({
                    error:true,
                    message: "Permission Denied!"
                }).status(500)
            }

        }
        else{
            res.status(401).json(new BodyResponse({message: "unAuthorization!",error:true,status:401}));
        }
    } catch (err) {
        res.status(500).json(new BodyResponse({
            status:500,
            error:true,
            message: err.message
        }));
    }
}
const isVillas = async (req,res,next)=> {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            if(user.role === "villa"){
                next();
            }else{
                res.json(new BodyResponse({
                    error:true,
                    status:500,
                    message: "Permission Denied!"
                })).status(500)
            }

        }
        else{
            res.status(401).json(new BodyResponse({message: "unAuthorization!",error:true,status:401}));
        }
    } catch (err) {
        res.status(401).json(new BodyResponse({message: "unAuthorization!",error:true,status:401}));
    }
}
export {
    verifyCurrentUser,
    isAuth,
    isAdmins,
    isVillas,
}
