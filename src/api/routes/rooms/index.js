import {Router} from 'express'
import {BodyResponse} from "@handler";
import self from './self'
import publicRoute from './public'
export default () => {
    const app = Router()
    publicRoute(app)
    app.use('/self', self())
    return app;
}

