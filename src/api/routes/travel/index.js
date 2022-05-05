import { MixedMiddlewares } from "@yuyuid/middlewares"
import { Router } from 'express'
import travels from './travels'
import {YuyuidConfig} from "@yuyuid/config";
import {isAuth} from "../../middlewares/auth";
// import auth from "../auth";
// import RouteUser from './users'
const jwt = require("jsonwebtoken");

export default ()=> {
    const app = Router();
    // app.use(isAuth);
    travels(app)
    // RouteUser(app)
    return app;
}
