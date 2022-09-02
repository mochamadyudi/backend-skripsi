import {Router} from 'express'
import {TravelCategory} from "../../../models/travel/travel_categories.schema.";
import Pagination from "../../../lib/utils/Pagination";
import {TravelValidator} from "../../../lib/validator";
import TravelTemplate from "../../../lib/utils/template/travel.template";
import {TravelCategoryController,CategoryController} from "@yid/controllers";
const route = Router()
export default function(){
    const app = Router()
    app.use('/', route)

    route.get('/list', new CategoryController().all)
    route.post('/',TravelValidator.CreateCategory,new CategoryController().create)
    route.get("/:id", new CategoryController().detail)
    route.get("/",new CategoryController().all)
    route.delete("/:id",new CategoryController().delete)
    return app
}
