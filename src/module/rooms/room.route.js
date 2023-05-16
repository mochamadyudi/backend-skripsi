import { Router } from 'express'
import {_MRoom} from "./index";
import {isAuth} from "../../api/middlewares/auth";
import {uploadFileMiddleware} from "../../lib/modules/uploaded";
const route = Router()

export default ()=> {
    const app = Router()
    app.use('/',route)

    route.put('/:id/photo',uploadFileMiddleware, isAuth,new _MRoom.Controller().uploadImage)
    route.get('/:id', isAuth,new _MRoom.Controller().detail)
    route.delete('/:id', isAuth,new _MRoom.Controller().delete)
    route.get('/',new _MRoom.Controller().list)
    return app
}