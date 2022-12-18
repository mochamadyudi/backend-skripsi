import { Router } from 'express'
import {_MVilla} from "@Modules";

const route = Router();

export default ()=> {
    const app = Router();
    app.use("/", route);

    route.get("/:villaId/detail-page", new _MVilla.Controller()._detailPage)
    route.get("/:villaId/transaction", new _MVilla.Controller()._detailTransaction)
    route.get('/:id',new _MVilla.Controller()._detailVila)
    return app
}