import verifyCurrentUser from './verifyCurrentUser'
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";
import {Villa} from "../../../models/villa/villa.schema";

const isAuth = async (req, res, next) => {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            req.user = user
            next();
        }else{
            res.status(401).json({message: "unAuthorization!"});
        }
    } catch (err) {
        res.status(401).json({message: "Token isnt valid!"});
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
            res.status(401).json({message: "unAuthorization!"});
        }
    } catch (err) {
        res.status(200).json({message: "Permission Denied!!"});
    }
}
const isVillas = async (req,res,next)=> {
    try {
        //Check if there isn't a token
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            if(user.role === "customer"){
                next();
            }else{
                res.json({
                    error:true,
                    message: "Permission Denied!"
                }).status(500)
            }

        }
        else{
            res.status(401).json({message: "unAuthorization!"});
        }
    } catch (err) {
        res.status(200).json({message: "Permission Denied!!"});
    }
}
export {
    verifyCurrentUser,
    isAuth,
    isAdmins,
    isVillas,
}
