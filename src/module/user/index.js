import UserController from "./user.controller";
import UserService from "./user.service";
import UserRoute from './user.route';
import {User} from "@yuyuid/models";
// import { OrderSchema } from "@"
export const _MUser = {
    Provider: User,
    Module: UserService,
    Controller: UserController,
    Route: UserRoute
}