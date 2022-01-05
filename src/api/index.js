import {Router} from 'express';
import auth from "./routes/auth";
import travelRoute from './routes/travel'
import userRoute from "./routes/user";
export default ()=> {
    const app = Router();

    auth(app)
    app.use('/self', userRoute())
    app.use('/travel', travelRoute())
    return app
}
