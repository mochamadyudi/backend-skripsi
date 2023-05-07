import RbacController from "./rbac.controller";
import RbacService from "./rbac.service";
import RbacRoute from './rbac.route';
// import { OrderSchema } from "@"
export const _MRBAC = {
    Provider: null,
    Module: RbacService,
    Controller: RbacController,
    Route: RbacRoute
}