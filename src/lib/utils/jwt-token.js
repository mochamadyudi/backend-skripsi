import { YuyuidConfig } from "@yuyuid/config";
import jwt from 'jsonwebtoken'
import {Villa} from "@yuyuid/models";

const generateToken = (user)=> {
    return jwt.sign(
        {userId:user.id,username: user.name},
        YuyuidConfig.jwtSecret,
        {expiresIn: "20m"}
    )
}

const generateTokenActivate = (payload)=> {
    return jwt.sign(payload,YuyuidConfig.jwtSecretActivate,{expiresIn: "20m"})
}

const makeIdRandom = (length = 5)=> {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const generateCustomToken = async(payload)=> {
    try{
        if(typeof(payload?.user) !== "undefined" && typeof(payload?.user?.role) !== "undefined"){
            if (payload?.user?.role === "villa"){
                await Villa.findOne({user:payload?.user.id}).select(['name','slug','photos'])
                    .then((result)=> {
                        Reflect.set(payload.user,"profile",result)
                    })
                    .catch((err)=> {

                    })
            }
        }

        console.log({payload})

        return jwt.sign(payload,YuyuidConfig.jwtSecret,{expiresIn:"1d"})
    }catch(err){
        return null
    }
}

const decodeJwtToken = (token)=> {
    try{
        return jwt.verify(token, YuyuidConfig.jwtSecret)
    }catch (e){
        return null
    }
}


export { generateCustomToken, generateToken, decodeJwtToken,generateTokenActivate,makeIdRandom}
