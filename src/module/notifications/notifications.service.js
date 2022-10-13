import {BookingSchema} from "../../models/booking/booking.schema";

export default class NotificationsService{
    constructor(props = {}) {
        this.req = props?.req ?? undefined
        this.res = props?.res ?? undefined
        this.body = props?.body ?? {}
        this.id = props?.id ?? undefined
        this.orderBy = props?.orderBy ?? "_id"
        this.query = props?.query ?? {}
        this.method = props?.method ?? {}
        this.path = props?.path ?? {}
        this.schema = BookingSchema
        this.fields = props?.fields ?? {}
    }
}