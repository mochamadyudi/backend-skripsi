import { YuyuidConfig } from '@yuyuid/config'
import { Request } from 'express'
import jwt from 'express-jwt'

const IGNORE_PATH = [];


/**
 * We are assuming that the JWT will come in a
 * header with the form
 *
 * `Authorization: Bearer ${JWT}`
 *
 * @param {Request} req Express req Object
 * @returns {(string | null )} Extracted Token or null
 */
const getTokenFromHeader = (req)=> {
    /**
     * Edge and Internet Explorer do some weird things with the headers
     * So I believe that this should handle more 'edge' cases ;)
     */
    if (
        (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token") ||
        (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
    ) {
        return req.headers.authorization.split(" ")[1]
    }

    return null
}

const isAuth = jwt({
    secret : YuyuidConfig.jwtSecret, // The _secret_ to sign the JWTs
    userProperty: "token", // Use req.token to store the JWT
    getToken: getTokenFromHeader, // How to extract the JWT from the request
    credentialsRequired: false,
    algorithm: ["HS256"]
}).unless({ path: IGNORE_PATH})

export default  isAuth
