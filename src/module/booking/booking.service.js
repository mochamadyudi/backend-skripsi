import {BookingSchema} from "../../models/booking/booking.schema";
import moment from "moment";
import Lpad from "../../lib/utils/lpad";
import Pagination from "../../lib/utils/Pagination";
import LibService from "../../services/lib.service";
import {UpRole} from "@yuyuid/models";
import {BodyResponse} from "@handler";
import {ObjResolve, ToBoolean} from "@yuyuid/utils";
import __ConfRooms from "../__tmp/confirm-rooms";

export default class BookingService extends LibService {
    constructor(props = {}) {
        super(props)
        this.schema = BookingSchema
        this.isUser = props?.isUser ?? false
    }


    async create() {
        try {
            let fields = this.fields
            let book_date = moment(this.fields?.book_date ?? null, 'YYYY-MM-DD')

            const book_number = await new Lpad({schema: this.schema}).get()
            Reflect.set(fields, 'book_date', book_date)
            Reflect.set(fields, 'book_number', book_number)
            let data = new this.schema({
                ...fields
            })

            const [confErr, confData] = await new __ConfRooms.Module({
                fields: {
                    book: data?.id,
                    user: data?.user,
                    room: data?.room ,
                    book_date: book_date,
                }
            }).create()

            console.log({confData, confErr})
            await data.save()


            return [null, data]
        } catch (err) {
            return [err, null]
        }
    }

    async update() {
    }

    async delete() {

    }

    async read() {
    }

    async list() {
        const {page, limit, direction} = Pagination(this.query)
        let response = {
            query: {
                limit,
                page: page > 0 ? page : 1,
                direction,
            },
            pagination: {
                page: page > 0 ? page : 1,
                limit: limit,
                max_page: 0,
                total_record: 0,
                current_page: page > 0 ? page : 1,
            },
            data: []
        }
        let condition = {}
        try {
            let room_populate = {
                path: "room",
                select: "-price -user",
                populate: {
                    path: "villa",
                    select: "name slug likes rates seen photos"
                }
            }


            if (this.isUser) {
                Reflect.set(condition, 'user', this.req.user.id)
            }

            if (ObjResolve(this.query, 'status')) {
                Reflect.set(condition, 'status', {
                    $in: Array.isArray(ObjResolve(this.query, 'status')) ? ObjResolve(this.query, 'status') : [ObjResolve(this.query, 'status')]
                })
            }

            let count = await this.schema.count(condition)

            let scheme = this.schema.find(condition)


            if (ObjResolve(this.query, '_room') && ToBoolean(ObjResolve(this.query, '_room')) === true) scheme.populate(room_populate)


            return await scheme
                .limit(limit)
                .sort({
                    [ObjResolve(this.query, 'orderBy') ?? "book_number"]: direction
                })
                .skip(limit * (page > 1 ? page : 0))
                .then((val) => {
                    Reflect.set(response.pagination, 'max_page', Math.ceil(count / limit))
                    Reflect.set(response.pagination, 'total_record', count)
                    Reflect.set(response, 'data', val)

                    return [null, response]
                })
                .catch((err) => {
                    return [err, response]
                })
        } catch (err) {
            return [err, response]
        }
    }

}