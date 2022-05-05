import YuyuidError from "@yuyuid/exception";
import { decodeJwtToken } from "@yuyuid/utils";
import { Request, Response, NextFunction } from "express";

/**
 *
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
const verifyToken = async (req, res, next) => {
    try {
        const result = decodeJwtToken(req.body.token);
        if (!result) throw YuyuidError.badData("Invalid Token");
        Reflect.set(req.body, "userId", result.userId);
        return next();
    } catch (err) {
        return next(err);
    }
};

export default verifyToken;
//# sourceMappingURL=index.js.map