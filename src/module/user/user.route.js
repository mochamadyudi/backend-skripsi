import { Router } from 'express'
import {_MUser} from "./index";
import {isAuth} from "../../api/middlewares/auth";
const route = Router()

export default ()=> {
    const app = Router()
    app.use('/',route)

    route.get('/:id', isAuth,new _MUser.Controller().detail)
    route.get('/', isAuth,new _MUser.Controller().list)
    return app
}