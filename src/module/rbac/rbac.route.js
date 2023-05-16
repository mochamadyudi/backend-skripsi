import { Router } from 'express'
import {_MRBAC} from "./index";
import {RbacValidator} from "../../lib/validator";
const route = Router()

export default ()=> {
    const app = Router()
    app.use('/',route)

    route.patch("/role/:id/privilege/:privilegeId",new _MRBAC.Controller().roleList)
    route.put("/role/:id",new _MRBAC.Controller().roleList)
    route.delete("/role/:id",new _MRBAC.Controller().roleDelete)
    route.get("/role/:id",new _MRBAC.Controller().roleList)
    route.get("/role",new _MRBAC.Controller().roleList)
    route.post("/role",RbacValidator.RoleCreate,new _MRBAC.Controller().roleCreate)
    return app
}