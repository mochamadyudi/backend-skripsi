import { Router } from 'express'
import {isAuth} from "../../api/middlewares/auth";
import {_MBooking} from "@Modules";
const route = Router()

export default (app)=> {
    app.use('/book',isAuth,route)

    route.post("/", new _MBooking.Controller().create)
}