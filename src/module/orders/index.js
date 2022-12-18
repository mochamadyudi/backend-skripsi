import OrderController from "./order.controller";
import OrderService from "./order.service";
import OrderRoute from './order.route';
// import { OrderSchema } from "@"
export const _MOrder = {
    Provider: null,
    Module: OrderService,
    Controller: OrderController,
    Route: OrderRoute
}