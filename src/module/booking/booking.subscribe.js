import {YuyuidEmitter} from "@yuyuid/utils";
import {YuyuidEvent} from "@yuyuid/constants";
import {_MBooking} from "@Modules";

class BookingSubscribe {
    constructor(props) {
        this.room = props?.room ?? null
        this.id = props?.id ?? null
        this.status = props?.status ?? null
        this.orderBy = props?.orderBy ?? "_id"
    }

    async _updateStatus() {
        try {
            const [err, data] = await new _MBooking.Module({})
        } catch (err) {
            return [err, null]
        }
    }
}

YuyuidEmitter.on(YuyuidEvent.book.create, async function (email = '', _id = '', room = {}) {

    YuyuidEmitter.dispatch(YuyuidEvent.email.book.create, {
        email: email,
        _id: _id,
        url: [process.env.APP_URL,'room',room?._id, `${room?.name}`.toLowerCase().replace(/ /g,'-')].join("/")
    })
})