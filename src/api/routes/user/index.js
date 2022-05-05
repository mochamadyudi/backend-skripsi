// import { MixedMiddlewares } from "@yuyuid/middlewares"
import { Router } from 'express'
import profile from './profile'
import Permissions from '../permissions/roles/index'
import {YuyuidConfig} from "@yuyuid/config";
import {isAuth} from "../../middlewares/auth";

export default ()=> {
    const app = Router();
    app.use(isAuth);
    profile(app)
    Permissions(app)

    return app;
}
