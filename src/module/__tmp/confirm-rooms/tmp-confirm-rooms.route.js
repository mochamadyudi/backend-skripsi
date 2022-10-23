import { Router } from 'express'
import __ConfRooms from "./index";
import {isAuth} from "../../../api/middlewares/auth";
import {RoomsValidator} from "../../../lib/validator";

const route = Router()

export default (app)=> {
    app.use('/queue-room',isAuth,route)

    route.get("/", new __ConfRooms.Controller().get)
    route.patch("/:id",RoomsValidator.ConfirmRoomQueue, new __ConfRooms.Controller().update)
}