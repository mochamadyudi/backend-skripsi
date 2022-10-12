import OrderController from "./order.controller";
import OrderService from "./order.service";
import {OrderSchema} from "./order.schema";

export const _MOrder = {
    Provider: OrderSchema,
    Module: OrderService,
    Controller: OrderController
}