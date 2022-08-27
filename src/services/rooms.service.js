import {Room, Villa} from "@yuyuid/models";
import {ObjResolve} from "@yuyuid/utils";
import Pagination from "../lib/utils/Pagination";
import {JSONParser} from "formidable/src/parsers";

export default class RoomsService {
    constructor(props = {}) {
        this.props = {
            ...props
        }
        this.body = props?.body ?? {}
        this.query = props?.query ?? {}

    }

    async _list(id = null) {
        try {
            if (id) {
                const [err, data] = await this.#single(id)
                if (err) return [err, null]
                return [null, data]
            }
            const {page, limit, direction} = Pagination(this.query)
            let condition = {}

            let villa = await Villa.find({
                'locations.districts': ObjResolve(ObjResolve(this.query,'villa'),'districts') ??{
                    $ne: null
                },

            },).select("_id")




            this.#RoomParams(condition)
            Reflect.set(condition,"villa", {
                $in:villa.map((item)=> item?._id)
            })

            let count = await Room.count(condition)
                .populate({
                path: "villa",
                select: "-_id locations.districts",
                populate: {
                    path: "locations.districts",
                }
            })
            count = count.length ?? count
            let response = {
                params: {
                    ...this.query,
                    page, limit, direction,

                },
                pagination: {
                    page,
                    limit,
                    max_page: Math.ceil(count / limit),
                    total_record: count,
                },
                data: []
            }
            return await Room.find({...condition})
                .populate({
                    path: "villa",
                    // select: "locations.districts",
                    select: '-_id',
                    // match: {
                    //   _id:"62f8f3c6b6c688c5f2831841"
                    // },
                    match:{
                        user:"6200018a3f2b1398169b0674"
                    },
                    // match:ObjResolve(this.query,"villa"),
                    populate: {
                        path: "locations.districts",
                    }
                })
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .then((result) => {
                    Reflect.set(response, 'data', result)
                    return [null, response]
                })
                .catch((err) => {
                    return [err, null]
                })


        } catch (err) {
            return [err, null]
        }
    }


    /**
     *
     * @param id
     * @returns {Promise<*[]>}
     */
    async #single(id) {
        try {
            let query = this.query
            let condition = {}

            if (ObjResolve(query, 'orderBy')) {
                Reflect.set(condition, ObjResolve(query, 'orderBy'), id)
            }
            return await Room.findOne(condition)
                .then((result) => {
                    return [null, result]
                })
                .catch((err) => {
                    return [err, null]
                })
        } catch (err) {
            return [err, null]
        }
    }

    /**
     *
     * @returns {Promise<*[]|*>}
     */
    async #RoomParams(obj) {
        let query = this.query
        if (Object.keys(query).length > 0) {
            Object.keys(query).forEach(key => {
                if (typeof (ObjResolve(query, key)) === "string") {
                    if (typeof (ObjResolve(query, key)) === "string") {
                        Reflect.set(query, key, ObjResolve(query, key))
                    } else if (typeof (ObjResolve(query, key)) === "number") {
                        Reflect.set(query, key, parseInt(ObjResolve(query, key)))
                    }
                } else if (typeof (ObjResolve(query, key)) === "number") {
                    Reflect.set(query, key, parseInt(ObjResolve(query, key)))
                } else if (typeof (ObjResolve(query, key)) === "object") {
                    Reflect.set(query, key, ObjResolve(query, key))
                }
            })
        }

        if (ObjResolve(query, "room_limit")) {
            if (typeof (ObjResolve(query, 'room_limit')) === "object") {
                Object.keys(ObjResolve(query, 'room_limit')).forEach((key) => {
                    Reflect.set(ObjResolve(query, 'room_limit'), key, JSON.parse(query['room_limit'][key]))
                })
            }
            Reflect.set(obj, "limit", ObjResolve(query, 'room_limit'))
        }
        if (ObjResolve(query, "unit")) {
            if (typeof (ObjResolve(query, 'unit')) === "object") {
                Object.keys(ObjResolve(query, 'unit')).forEach((key) => {
                    if (query['unit'][key] === "true" || query['unit'][key] === "false") {
                        Reflect.set(query['unit'], key, query['unit'][key] === "true")
                    } else {
                        Reflect.set(ObjResolve(query, 'unit'), key, query['unit'][key])
                    }

                })
            }
            Reflect.set(obj, "unit", ObjResolve(query, 'unit'))
        }


        if (ObjResolve(query, 'price_min') || ObjResolve(query, 'price_max')) {
            let min = 0
            let max = 20000000
            if (ObjResolve(query, 'price_min')) {
                min = !isNaN(parseInt(ObjResolve(query, 'price_min'))) ? parseInt(ObjResolve(query, 'price_min')) : 0
            }
            if (ObjResolve(query, 'price_max')) {
                max = !isNaN(parseInt(ObjResolve(query, 'price_max'))) ? parseInt(ObjResolve(query, 'price_max')) : 20000000
            }
            Reflect.set(obj, 'price.regular', {$exists: true, $gt: min, $lt: max})
        }
        if (ObjResolve(query, "currency")) {
            let currency = {
                $exists: true,
            }
            if (ObjResolve(query['currency'], "exists")) {
                Reflect.set(currency, '$exists', ObjResolve(query['currency'], "exists") === "true")
            }
            if (ObjResolve(query['currency'], "in")) {
                Reflect.set(currency, "$in", ObjResolve(query['currency'], "in"))
            }
            if (ObjResolve(query['currency'], "nin")) {
                Reflect.set(currency, "$nin", ObjResolve(query['currency'], "nin"))
            }

            Reflect.set(obj, "currency", currency)
        }

    }


}
