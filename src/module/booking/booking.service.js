import {BookingSchema} from "../../models/booking/booking.schema";
import moment from "moment";
import Lpad from "../../lib/utils/lpad";

export default class BookingService {
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


    async create(){
        try{
            let fields = this.fields
            let book_date = moment(this.fields?.book_date ?? null,'YYYY-MM-DD')

            const book_number = await new Lpad({schema:this.schema}).get()
            Reflect.set(fields,'book_date', book_date)
            Reflect.set(fields,'book_number', book_number)
            let data = new this.schema({
                ...fields
            })

            await data.save()


            return [ null, data ]
        }catch(err){
            return [err , null ]
        }
    }

    async update(){}

    async delete(){

    }

    async read(){}

    async list(){}

}