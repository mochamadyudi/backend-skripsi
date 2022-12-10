import { Router } from 'express'
import AuthRoute from './auth/index'
import {_MVilla,_MOrder} from "@Modules";

const route = Router()
export default ()=> {
    const app = Router()
    app.use("/",route)
    AuthRoute(app)

    route.use('/villa',_MVilla.Route.v2())
    route.use("/order",_MOrder.Route())

    return app
}
