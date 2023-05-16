import RoomController from "./room.controller";
import RoomService from "./room.service";
import RoomRoute from './room.route';
import {Room} from "@yuyuid/models";
// import { OrderSchema } from "@"
export const _MRoom = {
    Provider: Room,
    Module: RoomService,
    Controller: RoomController,
    Route: RoomRoute
}