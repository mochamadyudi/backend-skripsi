import {Router} from 'express';
import auth from "./routes/auth";
import travelRoute from './routes/travel'
import userRoute from "./routes/user";
import AdminRoute from "./routes/admin"
const request = require('request').defaults({ encoding: null });
import fs from "fs";
export default ()=> {
    const app = Router();

    auth(app)
    app.use('/admin',AdminRoute())

    app.use('/self', userRoute())
    app.use('/travel', travelRoute())
    return app
}
