import { Request, Response, NextFunction } from "express";
import YuyuidError from "@yuyuid/exception";
// import { User } from "@bitevo/models";


const verifyCurrentUser = async (req, res, next) => {
    try {
        console.log(req);
        const userRecord = await User.findById(req.token.userId);
        if (!userRecord) {
            throw YuyuidError.unauthorized();
        }
        let currentUser = userRecord.toJSON();
        Reflect.deleteProperty(currentUser, "password");
        Reflect.deleteProperty(currentUser, "salt");
        req.user = {
            currentUser,
            userId: currentUser.id
        };
        return next();
    } catch (e) {
        return next(e);
    }
};

export default verifyCurrentUser;
//# sourceMappingURL=verifyCurrentUser.js.map