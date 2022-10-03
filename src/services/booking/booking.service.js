import LibService from "../lib.service";
import {BookingSchema} from "../../models/booking/booking.schema";
import YuyuidError from "@yuyuid/exception";
import {first} from 'lodash'
import strpad from "strpad";
import {ObjResolve} from "@yuyuid/utils";

export default class BookingService extends LibService {
    constructor(props) {
        super(props)
        this.schema = props?.schema ?? BookingSchema
    }

    async addBook() {
        try {
            this.schema = BookingSchema
            if (Object.keys(this.fields).length > 0) {
                const count = await BookingSchema.count()
                Reflect.set(this.fields, 'book_number', strpad.left(count + 1, 5, 0))
            }
            const [err, data] = await this.create()
            if (err) throw YuyuidError.badData(first(err?.errors)?.message ?? err ?? "Some Error")
            return [null, data]
        } catch (err) {
            return [err, null]
        }
    }

    async lists() {
        try {
            let condition = {}
            let schema = this.schema.find(condition)
            let roomPopulate ={
                path:"room",
            }
            let otherPopulateRoom = {
                populate: []
            }
            if(ObjResolve(this.query,'withVilla') && ObjResolve(this.query,'withVilla')  === "true" ){
                otherPopulateRoom.populate.push({
                    path:"villa",
                    select:"-social"
                })
                Reflect.set(roomPopulate,'populate',otherPopulateRoom.populate)
            }
            schema.populate(roomPopulate)

            schema.populate("user",['-password','-salt'])

            return await schema.then((result) => {
                return [null, result]
            })
                .catch((err) => {
                    return [err, null]
                })
            // .exec((error, result)=> {
            //     if(error) return [ error, null]
            //     return [ null , result ]
            // })
        } catch (err) {
            return [err, null]
        }
    }


}