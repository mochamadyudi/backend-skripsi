import { Router } from 'express';

import { YuyuidConfig } from "@yuyuid/config";
import { MixedMiddlewares } from "@yuyuid/middlewares";
const jwt = require("jsonwebtoken");
import drive from "./drive";

const auth = (req, res, next) => {
    try {
        //Check if there isn't a token
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token" || req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, YuyuidConfig.jwtSecret);
            // console.log(decoded,token)
            // console.log(decoded)
            req.user = decoded.user;
            next();
        }
    } catch (err) {
        res.status(401).json({ message: "Token isnt valid!" });
    }
};
export default (() => {
    const app = Router();
    // app.use(auth);
    drive(app);
    return app;
});
//# sourceMappingURL=index.js.map