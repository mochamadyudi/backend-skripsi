import {Router} from 'express';
import auth from "./routes/auth";
import travelRoute from './routes/travel'
import userRoute from "./routes/user";
import AdminRoute from "./routes/admin"
import VillaRoute from './routes/villa';
import Locations from './routes/locations'
import CategoryRoute from './routes/travel/category'
// const request = require('request').defaults({ encoding: null });
import RoomsRoute from './routes/rooms'

import Scraping from './routes/scraping/locations'

export default ()=> {
    const app = Router();
    auth(app)
    Locations(app)

    app.use('/villa', VillaRoute())
    app.use('/admin',AdminRoute())

    app.use('/self', userRoute())
    app.use('/travel', travelRoute())

    /**
     * scope public
     */

    app.use("/category",CategoryRoute())
    app.use('/rooms', RoomsRoute())

    app.use('/scraping', Scraping())

    return app
}
