import RouteTransaction from './transaction-order.route'
import TransactionOrderModule from "./transaction-order.module";
import TransactionOrderController from "./transaction-order.controller";
import TransactionOrderSubscribe from "./transaction-order.subscribe";
const _MTransactionOrder = {
    Module: TransactionOrderModule,
    Controller:TransactionOrderController,
    Subscribe:TransactionOrderSubscribe,
    Route:RouteTransaction,

}

export default _MTransactionOrder