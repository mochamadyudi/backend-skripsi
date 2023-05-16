import { Router } from 'express'
import AuthRoute from './auth/index'
import {_MVilla, _MOrder, _MUser, _MRoom} from "@Modules";
import { isAuth } from "../middlewares/auth";
import {_MRBAC} from "../../module/rbac";

const route = Router()
export default ()=> {
    const app = Router()
    app.use("/",route)
    AuthRoute(app)

    route.use('/rbac', _MRBAC.Route())
    route.use('/room', _MRoom.Route())
    route.use('/user',isAuth, _MUser.Route())
    route.use('/villa',_MVilla.Route.v2())
    route.use("/order",_MOrder.Route())

    return app
}
