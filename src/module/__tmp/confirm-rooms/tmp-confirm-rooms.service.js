import LibService from "../../../services/lib.service";
import {ConfirmRoomsSchema} from "@yuyuid/models";
import Pagination from "../../../lib/utils/Pagination";
import {_ArrBooleanValue, ObjResolve, StrToBool, ToBoolean} from "@yuyuid/utils";
import {ObjectId} from "mongodb";
import {ClearCountAggregate, ToObjId} from "../../../aggregate";
import {first} from "lodash";
import {RoomSchedule} from "../../../models/rooms/room_schedule.schema";
import moment from "moment";
import YuyuidError from "@yuyuid/exception";

export default class TmpConfirmRoomsService extends LibService {
    constructor(props) {
        super(props);
        this.schema = ConfirmRoomsSchema
        this.isVilla = props?.isVilla ?? false
        this.user = props?.user ?? undefined
    }

    async create() {
        try {
            let data = new this.schema(this.fields)
            await data.save()
            return [null, data]
        } catch (err) {
            return [err, null]
        }

    }


    async update() {
        try {
            let condition = {
                [this.orderBy ?? "_id"]: this.id
            }

            return await this.schema.findOneAndUpdate(
                condition,
                {
                    $set:{
                        ...this.fields,
                    }
                },
                {
                    rawResult:false,
                }
            )
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


    async checkUserSchedule(props = {user : '',room : '',isActive : false,status : 'waiting'}){
        let fields = {}

        Object.keys(props).forEach((key)=> {
            Reflect.set(fields,key,props[key])
        })
        return await RoomSchedule.findOne(fields)
            .then((result)=> {
                return [ null , result]
            })
            .catch((err)=> {
                return [ err, null ]
            })
    }

    async accepted(){
        try{
            let condition = {
                [this.orderBy ?? '_id']: this.id
            }
            let fields = {}
            const [checkQueue, dataQueue]=  await this.schema.findOne(condition)
                .then((result)=> {
                    console.log(result,'RESULT')
                    return [ null , result]
                })
                .catch((err)=> {
                    return [ err, null ]
                })
            if(checkQueue) return [ checkQueue, null]
            if(!dataQueue) return [ new Error('not found'), null]

            const  [errCheck,dataCheck] = await this.checkUserSchedule({
                $or:[
                    {
                        user: ObjResolve(dataQueue,'user')
                    },
                    {
                        room:ObjResolve(dataQueue,'room')
                    }
                ],
                isActive:{$in:[true,false]},
                status:{
                    $exists: true,
                    $in: [ 'waiting', 'completed']
                },
                outDate: {
                    $exists: true,
                    $in:[ null ]
                }
            })

            if(errCheck) return [ errCheck, null ]
            if(dataCheck) return [ new Error('Error: cannot be continued, there are still active bookings') , null ]

            const [err,data] = await this.schema.findOneAndUpdate(condition,{
                $set: {
                    ...this.body,
                    status: ObjResolve(this.body,'status')
                }
            },{rawResult:true}).then(({value,ok})=> {
                if(ok > 0){
                    return [ null, value ]
                }
                return [ new Error('not found or not update!'),null]
            })
                .catch((err)=> {
                    return [ err, null ]
                })

            if(err) return [ err, null ]

            /**
             * @description check user and rooms
            */

            let schedule = new RoomSchedule({
                user: ObjResolve(data,'user'),
                book: ObjResolve(data,'book'),
                room: ObjResolve(data,'room'),
                entryDate: ObjResolve(data,'book_date'),
                isActive:false,
                status:'waiting',
                expiresOn: moment(ObjResolve(data,'book_date')).add(2,'day')
            })
            //
            await schedule.save();
            return [ err, {data,schedule} ]
        }catch(err){
            return [ err, null ]
        }
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
        let aggregate = []
        try {
            let matches = {
                "room.user._id": {
                    $in: [ToObjId(this.user.id)]
                }
            }
            if (ObjResolve(this.query, 'withUser') && ToBoolean(ObjResolve(this.query, 'withUser')) === true) {
                aggregate.push({
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    }
                })
                aggregate.push({$unwind: {path: "$user", preserveNullAndEmptyArrays: true}})
                aggregate.push({$project: {"user.password": 0, "user.salt": 0,}})
                aggregate.push({
                    $lookup: {
                        from: "users_profiles",
                        localField: "user._id",
                        foreignField: "user",
                        as: "user.profiles"
                    }
                })
                aggregate.push({$unwind: {path: "$user.profiles", preserveNullAndEmptyArrays: true}})
                aggregate.push({$project: {'profile.user': 0,'user.profiles':0}})
            }
            aggregate.push({
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "room",
                }
            })
            aggregate.push({
                $unwind: {
                    path: "$room",
                    preserveNullAndEmptyArrays: true
                }
            })
            aggregate.push({
                $lookup: {
                    from: "users",
                    localField: "room.user",
                    foreignField: "_id",
                    as: "room.user"
                }
            })
            aggregate.push({$unwind: {path: "$room.user", preserveNullAndEmptyArrays: true}})


            if (ObjResolve(this.query, 'status')) {
                Reflect.set(matches, 'status', {
                    $in: Array.isArray(ObjResolve(this.query, 'status')) ? ObjResolve(this.query, 'status') : [ ObjResolve(this.query, 'status') ]
                })
            }
            if (ObjResolve(this.query, 'is_expired')) {
                let is_expired = []

                if (Array.isArray(ObjResolve(this.query, 'is_expired'))) {
                    is_expired = _ArrBooleanValue(ObjResolve(this.query, 'is_expired'))
                } else {
                    is_expired = [ToBoolean(ObjResolve(this.query, 'is_expired'))]
                }

                Reflect.set(matches, 'is_expired', {
                    $in: is_expired
                })
            }

            /**
             * MATCH
             * @type {Aggregate<Array<any>>}
             */
            if (this.isVilla) {
                aggregate.push({
                    $match: {
                        ...matches
                    }
                })
            }

            aggregate.push({
                $project:{'room.user':0,'room.wishlists':0,'room.facility':0,'room.schedule':0}
            })
            let count = await this.schema.aggregate([...aggregate, {$count: "total_record"}])
            let scheme = this.schema.aggregate(aggregate)
            return await scheme
                .limit(limit)
                .sort({
                    [ObjResolve(this.query, 'orderBy') ?? "book_number"]: direction === "desc" ? -1 : 1
                })
                .skip(limit * (page > 1 ? page : 0))
                .then((val) => {
                    Reflect.set(response.pagination, 'max_page', Math.ceil(ClearCountAggregate(count, 'total_record') / limit))
                    Reflect.set(response.pagination, 'total_record', ClearCountAggregate(count, 'total_record'))
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