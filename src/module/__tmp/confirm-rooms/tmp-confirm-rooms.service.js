import LibService from "../../../services/lib.service";
import {ConfirmRoomsSchema} from "@yuyuid/models";
import Pagination from "../../../lib/utils/Pagination";
import {_ArrBooleanValue, ObjResolve, StrToBool, ToBoolean} from "@yuyuid/utils";
import {ObjectId} from "mongodb";
import {ClearCountAggregate, ToObjId} from "../../../aggregate";
import {first} from "lodash";

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
                aggregate.push({$project: {'profile.user': 0}})
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