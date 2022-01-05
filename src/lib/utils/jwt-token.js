import { YuyuidConfig } from "@yuyuid/config";
import jwt from 'jsonwebtoken'

const generateToken = (user)=> {
    return jwt.sign(
        {userId:user.id,username: user.name},
        YuyuidConfig.jwtSecret,
        {expiresIn: "20m"}
    )
}

const generateCustomToken = (payload)=> {
    return jwt.sign(payload,YuyuidConfig.jwtSecret,{expiresIn:"1m"})
}

const decodeJwtToken = (token)=> {
    try{
        return jwt.verify(token, YuyuidConfig.jwtSecret)
    }catch (e){
        return null
    }
}


export { generateCustomToken, generateToken, decodeJwtToken}
