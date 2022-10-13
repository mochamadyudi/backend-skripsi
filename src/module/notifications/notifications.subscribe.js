import {YuyuidEmitter} from "@yuyuid/utils";
import {YuyuidEvent} from "@yuyuid/constants";


class NotifySubscribe {
    constructor() {
        YuyuidEmitter.on(YuyuidEvent.notify.book.push, this._pushCreateBook)
        YuyuidEmitter.on(YuyuidEvent.notify.book.update.status, this._pushUpdateStatusBook)
        YuyuidEmitter.on(YuyuidEvent.notify.book.update.bulk_read, this._pushBulkUpdateBookIsRead)
    }
    async _pushCreateBook(params = {}){}
    async _pushUpdateStatusBook(params = {}){

    }
    async _pushBulkUpdateBookIsRead(params = {}){}
}
new NotifySubscribe()