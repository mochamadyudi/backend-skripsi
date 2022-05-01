import { YuyuidConfig } from "@yuyuid/config";
import jwt from 'jsonwebtoken'

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
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const generateCustomToken = (payload)=> {
    return jwt.sign(payload,YuyuidConfig.jwtSecret,{expiresIn:"1d"})
}

const decodeJwtToken = (token)=> {
    try{
        return jwt.verify(token, YuyuidConfig.jwtSecret)
    }catch (e){
        return null
    }
}


export { generateCustomToken, generateToken, decodeJwtToken,generateTokenActivate,makeIdRandom}
