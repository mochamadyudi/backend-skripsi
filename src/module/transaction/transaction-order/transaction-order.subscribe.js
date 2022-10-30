import {YuyuidEmitter} from "@yuyuid/utils";
import {YuyuidEvent} from "@yuyuid/constants";

export default class TransactionOrderSubscribe {
    constructor(props) {
        YuyuidEmitter.on(YuyuidEvent.email.transaction.waiting,this._emailTransactionWaiting)
    }

    async _emailTransactionWaiting(){

    }
}