import {ConfirmRoomsSchema, Room, Villa} from "@yuyuid/models";
import {ObjResolve, StrToBool} from "@yuyuid/utils";
import Pagination from "../lib/utils/Pagination";
import {JSONParser} from "formidable/src/parsers";

export default class RoomsService {
    constructor(props = {}) {
        this.props = {
            ...props
        }
        this.id = props?.id ?? null
        this.orderBy = props?.orderBy ?? "_id"
        this.body = props?.body ?? {}
        this.query = props?.query ?? {}

    }

    async get(){
        try {
            let query = this.query
            let condition = {
                [this.orderBy]:this.id
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
    async _list(id = null) {
        try {
            if (id !== null ) {
                const [err, data] = await this.#single(id)
                if (err) return [err, null]
                return [null, data]
            }
            const {page, limit, direction} = Pagination(this.query)
            let condition = {}
            let villa = null

            // if(Object.keys(this.query).length > 0){
                if(ObjResolve(this.query,'villaIn')){
                    Reflect.set(condition,'villa', {
                        $in: Array.isArray(ObjResolve(this.query,'villaIn')) ? ObjResolve(this.query,'villaIn') : [ObjResolve(this.query,'villaIn')]
                    })
                }else{
                    if(ObjResolve(this.query,'villa') !== null){
                        if(ObjResolve(ObjResolve(this.query,'villa'),'districts')){
                            villa = await Villa.find({
                                'locations.districts':  ObjResolve(ObjResolve(this.query,'villa'),'districts') ??{
                                    $ne: null
                                },
                            },).select("_id")

                            if(villa){
                                Reflect.set(condition,"villa", {
                                    $in:villa.map((item)=> item?._id)
                                })
                            }
                        }
                    }
                    this.#RoomParams(condition)
                }
            // }




            let count = await Room.count(condition)
                .populate({
                path: "villa",
                select: "-_id locations.districts",
                populate: {
                    path: "locations.districts",
                }
            })
            count = count?.length ?? count
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



    async _confirmQueue(){
        try{
            let body = this.body


        }catch(err){
            return [ err, null ]
        }
    }
    async _patch(){
        try{
            let where = {
                [this.orderBy]:this.id
            }
            let setFields = this.body
            let fields = {

            }

            console.log(this.body)

            if(ObjResolve(setFields,'facility')){
                let facility = {}
                if(ObjResolve(ObjResolve(setFields,'facility'),'ac')){
                    Reflect.set(facility,'ac',StrToBool(ObjResolve(ObjResolve(setFields,'facility'),'ac')))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'tv')){
                    Reflect.set(facility,'tv',StrToBool(ObjResolve(ObjResolve(setFields,'facility'),'tv')))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'wifi')){
                    Reflect.set(facility,'wifi',StrToBool(ObjResolve(ObjResolve(setFields,'facility'),'wifi')))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'smoking')){
                    Reflect.set(facility,'smoking',StrToBool(ObjResolve(ObjResolve(setFields,'facility'),'smoking')))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'smooking')){
                    Reflect.set(facility,'smoking',StrToBool(ObjResolve(ObjResolve(setFields,'facility'),'smooking')))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'other')){
                    Reflect.set(facility,'other',ObjResolve(ObjResolve(setFields,'facility'),'other'))
                }
                if(ObjResolve(ObjResolve(setFields,'facility'),'bed_type')){
                    Reflect.set(facility,'bed_type',ObjResolve(ObjResolve(setFields,'facility'),'bed_type'))
                }

                Reflect.set(setFields,'facility',facility)
            }
            if(ObjResolve(setFields,"price")){
                let price = {}
                if(ObjResolve(ObjResolve(setFields,"price"),'regular')){
                    Reflect.set(price,'regular',parseInt(ObjResolve(ObjResolve(setFields,"price"),'regular')) ?? 0)
                }
                if(ObjResolve(ObjResolve(setFields,"price"),'special')){
                    Reflect.set(price,'special',parseInt(ObjResolve(ObjResolve(setFields,"price"),'special')) ?? 0)
                }
                if(ObjResolve(ObjResolve(setFields,"price"),'discount')){
                    Reflect.set(price,'discount',parseInt(ObjResolve(ObjResolve(setFields,"price"),'discount')) ?? 0)
                }


                Reflect.set(setFields,"price",price)
            }
            if(ObjResolve(setFields,"limit")){
                Reflect.set(setFields,'limit',parseInt(ObjResolve(setFields,"limit")) ?? 1)
            }
            if(ObjResolve(setFields,"is_deleted")){
                Reflect.set(setFields,'is_deleted',StrToBool(ObjResolve(setFields,"is_deleted")))
            }
            if(ObjResolve(setFields,"is_available")){
                Reflect.set(setFields,'is_available',StrToBool(ObjResolve(setFields,"is_available")))
            }

            return await Room.findOneAndUpdate(
                {...where},
                {
                    $set: {
                        ...setFields
                    }
                },{
                    new: true,
                    rawResult:true,
                }
            )
                .then(({value})=> {
                    return [ null , value]
                })
                .catch((err)=> {
                    return [ err, null ]
                })
        }catch(err){
            return [err, null ]
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
                Reflect.set(condition, ObjResolve(query, 'orderBy') ?? "_id", id)
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

        let newObj = {}
        this.#FacilityParams(newObj,'ac')
        this.#FacilityParams(newObj,'tv')
        this.#FacilityParams(newObj,'wifi')
        let newArr = []
        Object.keys(newObj).forEach((key)=> {
            newArr.push({
                [key]:newObj[key]
            })
        })

        if(Array.isArray(newArr) && newArr.length > 0){
            Reflect.set(obj,'$or', newArr)
        }

    }
    async #FacilityParams(obj,keys){
        let query = this.query
        if(ObjResolve(query,keys)){
            if(typeof(ObjResolve(query,keys)) === "object"){
                let terms = "$in"
                let values = []
                Object.keys(ObjResolve(query,keys)).forEach((key)=> {
                    if(key === "terms"){
                        terms = query[keys][key]
                    }
                    if(key === "value"){
                        if(ObjResolve(ObjResolve(query,keys),key)){
                            if(Array.isArray(query[keys]['value']) && query[keys]['value'].length > 0){
                                let newItem = []
                                for(let i = 0; i < query[keys]['value'].length;i++){
                                    newItem.push(
                                        query[keys]['value'][i] === "true"
                                    )
                                }
                                values = newItem
                            }else{
                                values = query[keys]['value']
                            }
                        }
                    }
                })
                Reflect.set(obj,`facility.${keys}`, {
                    $exists:true,
                    [terms]:values
                })
            }

        }

        console.log({obj})
    }
}
