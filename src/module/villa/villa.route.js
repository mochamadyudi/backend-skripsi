import { Router } from 'express'
import {_MVilla} from "@Modules";
import VillaScopeService from "./scope/villa.scope.service";
import VillaScopeController from "./scope/villa.scope.controller";
import {CheckAuth, isAuth, isVillas} from "../../api/middlewares/auth";
import {uploadFileMiddleware, uploadFiles, uploadFileSingle} from "../../lib/modules/uploaded";

const route = Router();

export default ()=> {
    const app = Router();
    app.use("/", route);
    route.delete('/me/photos/:id',isAuth,CheckAuth,isVillas, new VillaScopeController().DeletePhoto)
    route.post('/me/photos',isAuth,CheckAuth,isVillas,uploadFileSingle.single('file'), new VillaScopeController().uploadPhotos)
    route.get('/me/photos',isAuth,CheckAuth,isVillas, new VillaScopeController().photos)
    route.get('/me',isAuth,CheckAuth,isVillas, new VillaScopeController().profile)


    route.get("/:villaId/detail-page", new _MVilla.Controller()._detailPage)
    route.get("/:villaId/transaction", new _MVilla.Controller()._detailTransaction)
    route.get('/:id',new _MVilla.Controller()._detailVila)
    route.get('/',new _MVilla.Controller().list)
    return app
}