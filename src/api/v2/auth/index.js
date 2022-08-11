import { Router } from 'express'
import {AuthControllerV2} from "../../../controllers/v2";

const route = Router()
export default (app)=> {
    app.use('/auth', route)
    route.post(`/signUp`,new AuthControllerV2()._signUp)

}
