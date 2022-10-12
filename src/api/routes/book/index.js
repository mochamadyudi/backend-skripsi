import { Router } from 'express'
import BookController from "../../../controllers/book/book.controller";
import {_MBooking} from "@Modules";

const route = Router()

export default (app)=> {
    app.use("/book",route)

    route.post("/", new _MBooking.Controller().create)
    route.get("/", new BookController().lists)
}