import {Router} from 'express';
import auth from "./routes/auth";
import travelRoute from './routes/travel'
import userRoute from "./routes/user";
import AdminRoute from "./routes/admin"
import VillaRoute from './routes/villa';
const request = require('request').defaults({ encoding: null });

export default ()=> {
    const app = Router();

    auth(app)

    app.use('/villa', VillaRoute() )
    app.use('/admin',AdminRoute())

    app.use('/self', userRoute())
    app.use('/travel', travelRoute())
    return app
}
