import { Router } from 'express'
import BookController from "../../../controllers/book/book.controller";

const route = Router()

export default ()=> {
    const app = Router()
    app.use("/",route)

    route.post("/",new BookController()._create)
    route.get("/", new BookController().lists)
    return app
}