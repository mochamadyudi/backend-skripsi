import LibService from "../../services/lib.service";
import {OrderSchema, User, Villa} from "@yuyuid/models";
import Pagination from "../../lib/utils/Pagination";
import {ObjResolve} from "@yuyuid/utils";
import {ObjectId, ObjectID} from "mongodb";
import {first} from "lodash";
import {BodyResponse} from "@handler";

export default class VillaService extends LibService {
    constructor(props) {
        super(props)
    }

    async list() {
        try {
            const {page, limit, direction} = Pagination(this.query)

            let condition = {}

            const data = await Villa.find(condition)
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])

            return [ null, data ]
        } catch (err) {
            return [err, null]
        }
    }

    async _detailVilla() {
        try {
            let data = await Villa.findOne({
                [this.orderBy ?? "_id"]: this.id
            })
                .populate({
                    path: "likes",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["likes"]
                })
                .populate({
                    path: "discuss",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path: "rates",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["rates"]
                })
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])

            return [null, data]
        } catch (err) {
            return [err, null]
        }
    }

    async _PageDetail() {
        try {
            let aggregate = [
                {
                    $lookup: {
                        from: "rooms",
                        localField: "_id",
                        foreignField: "villa",
                        as: "room"
                    }
                },
                {
                    $unwind: {
                        path: "$order",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "orders",
                        localField: "room._id",
                        foreignField: "room",
                        as: "order"
                    }
                },
                {
                    $lookup: {
                        from: "villa_rates",
                        localField: "_id",
                        foreignField: "villa",
                        as: "rates"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        room: {$first: "$room"},
                        order: {
                            $first: "$order"
                        },
                        data: {
                            $first: "$$ROOT"
                        },
                        count: {
                            $mergeObjects: {
                                room: {$size: "$room"},
                                order: {$size: "$order"},
                                likes: {$size: "$$ROOT.likes"},
                                photos: {$size: "$$ROOT.photos"},
                                videos: {$size: "$$ROOT.videos"},
                                rates: {$size: "$rates"},
                            }
                        }
                    }
                },

                {
                    $project: {
                        _id: 1,
                        'data.order': 0,
                        'data.room': 0,
                    }
                }
            ]
            /**
             * pagination
             */
            let order_pagination = {
                page: 0,
                limit: 10
            }

            if (ObjResolve(this.query, 'order_limit')) {
                let ordLimit = ObjResolve(this.query, 'order_limit')
                ordLimit = parseInt(ordLimit)
                if (!isNaN(ordLimit)) {
                    order_pagination.limit = ordLimit
                }
            }
            if (ObjResolve(this.query, 'order_page')) {
                let pages = ObjResolve(this.query, 'order_page')
                pages = parseInt(pages)
                if (!isNaN(pages)) {
                    order_pagination.page = order_pagination.limit * (pages > 1 ? pages - 1 : 0)
                }
            }
            let projected = {
                $project: {
                    _id: 1,
                    data: 1,
                    count: 1,
                    order: {
                        $slice: ['$order', order_pagination?.page, order_pagination?.limit]
                    },
                    room: {
                        $slice: ['$room', 0, 10]
                    }
                }
            }
            aggregate.push({...projected})
            if (this.id) {
                aggregate.push({
                    $match: {
                        [this.orderBy]: ObjectId(this.id)
                    }
                })
            }
            return await Villa.aggregate(aggregate)
                .then((value) => {
                    if (Array.isArray(value) && value.length > 0) {
                        return [null, first(value)]
                    }
                    return [null, null]
                })
                .catch((err) => {
                    return [err, null]
                })
        } catch (err) {
            return [err, null]
        }
    }

    async _Transaction() {
        try {
            const {page, limit, direction} = Pagination(this.query)
            let aggregate = []
            let lookup = [
                {
                    $lookup: {
                        from: "rooms",
                        localField: "room",
                        foreignField: "_id",
                        as: "room"
                    }
                },
                {
                    $unwind: {
                        path: "$room",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup: {
                        from: "villas",
                        localField: "room.villa",
                        foreignField: "_id",
                        as: "villa"
                    }
                },
                {
                    $unwind: {
                        path: "$villa",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        '_id': 1,
                        'order_number': 1,
                        'order_code': 1,
                        'createdAt': 1,
                        'hashId': 1,
                        'uuid': 1,
                        'user': 1,
                        'status': 1,
                        'amount': 1,
                        'limit': 1,
                        'expiresIn': 1,
                        'room._id': 1,
                        'room.name': 1,
                        'room.images': 1,
                        'room.createdAt': 1,
                        'room.updatedAt': 1,
                        'villa_type': 1,
                        'villa._id': 1,
                        'villa.name': 1,
                        'villa.slug': 1,
                        'villa.website': 1,
                        'villa.thumbnail': 1,
                        'villa.contact': 1,
                        'villa.photos': 1,
                    }
                },
                {
                    $group: {
                        _id: "$villa._id",
                        villa: {
                            $first: "$villa"
                        },
                        order: {
                            $push: {
                                "order_number": "$order_number",
                                "order_code": "$order_code",
                                "createdAt": "$createdAt",
                                "hashId": "$hashId",
                                "uuid": "$uuid",
                                "user": "$user",
                                "status": "$status",
                                "amount": "$amount",
                                "limit": "$limit",
                                "expiresIn": "$expiresIn",
                                "room": "$room",
                                "_id": "$_id"

                            }
                        },
                        total_order: {$sum: 1}
                    }
                },
                {
                    $project: {
                        villa: "$villa",
                        total_order: "$total_order",
                        order: {
                            $slice: ['$order', limit * (page > 1 ? page - 1 : 0), limit],
                        },
                    },
                },
            ]
            let match = []
            if (ObjResolve(this.query, 'order_number')) {
                match.push({
                    $match: {
                        "order_number": ObjResolve(this.query, 'order_number')
                    }
                })
            }
            if (this.id) {
                match.push({
                    $match: {
                        [this.orderBy ?? "villa._id"]: ObjectID(`${this.id}`)
                    }
                })
            }
            lookup.map((item) => {
                aggregate.push(item)
            })
            match.map((item) => {
                aggregate.push(item)
            })


            const data = await OrderSchema.aggregate(aggregate)
                .then((value) => {
                    if (Array.isArray(value) && value.length > 0) {
                        return first(value)
                    }
                    return null
                })
                .catch((err) => {
                    return null
                })
            return [null, data]
        } catch (err) {
            return [err, null]
        }
    }
}