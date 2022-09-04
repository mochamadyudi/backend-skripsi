import { Router } from 'express'
import TravelDiscussionsController from "../../../controllers/travel/travel-discussions.controller";
import {isAuth} from "../../middlewares/auth";

const route = Router()
export default ()=> {
    const app = Router()
    app.use('/',route)

    route.get('/', async (req,res)=> {
        return res.json('helloooo')
    })

    route.get("/:id", new TravelDiscussionsController()._getAllByTravel)

    route.post('/:id', isAuth, new TravelDiscussionsController()._add)
    route.put("/edit/:discussId",isAuth, new TravelDiscussionsController()._updateComment)
    return app
}
