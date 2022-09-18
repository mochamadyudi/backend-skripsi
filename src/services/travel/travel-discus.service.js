import {TravelDiscuss} from "@yuyuid/models";
import {ObjectId} from "mongodb";

export default class TravelDiscusService {
    constructor(props = {}) {
        this.fields = props?.fields ?? {}
        this.id = props?.id ?? null
        this.query = props?.query ?? {}
    }



    async get() {
        try {
            if (this.id) {
                return await this.#_getSingle(this.id)
            }
            return await this.#_getAll()
        } catch (err) {
            return [err, null]
        }
    }

    async add() {
        try {
            let discuss = await new TravelDiscuss({
                ...this.fields
            })

            await discuss.save()


            return [null, discuss]
        } catch (err) {
            return [err, null]
        }
    }

    async update(discussId) {
        try {

        } catch (err) {

        }
    }

    async reply(id) {
        try {

        } catch (err) {
            return [err, null]
        }
    }

    async #_getSingle(id) {
        try {
            let query = this.query

            let condition = [
                {
                    $match: {
                        travel: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'users', // change your original collection name
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $set:{
                        user: {$arrayElemAt: ["$user",0]}
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays:true
                    }
                },
                {
                    $lookup: {
                        "from": "users_profiles",
                        "localField": "user._id",
                        "foreignField": "user",
                        "as": "user.profiles"
                    }
                },
                {
                    $set:{
                        "user.profiles": {$arrayElemAt: ["$user.profiles",0]}
                    }
                },
                {
                    $lookup: {
                        from: 'travels', // change your original collection name
                        localField: 'travel',
                        foreignField: '_id',
                        as: 'travel'
                    }
                },
                {
                    $project: {
                        _id: { $cond: ['$parentDiscussId', '$parentDiscussId', '$_id'] },
                        'user.profiles.thumbnail':1,
                        'user.profiles.photos':1,
                        'user._id': 1,
                        'user.email': 1,
                        'user.firstName': 1,
                        'user.lastName': 1,
                        likes:1,
                        dislikes:1,
                        is_updated:1,
                        is_hidden:1,
                        date:1,
                        comment:1,
                        parentDiscussId: { $ifNull: ['$parentDiscussId', "$parentDiscussId",'$parentDiscussId'] },
                    },
                },
                {
                    $group: {
                        _id:"$_id",
                        // user:{
                        //     $first: "$user",
                        // },
                        comment: { $min: { $cond: ['$parentDiscussId',"$parentDiscussId", "$comment"] } },
                        count_replies:{$sum:1},
                        replies: {
                            $push: {
                                $cond: ['$parentDiscussId',"$parentDiscussId", '$$REMOVE']
                            }
                        },
                    },
                }
            ]

            const discuss = await TravelDiscuss.aggregate(condition).exec()
            return [null, discuss]

        } catch (err) {
            return [err, null]
        }

    }

    async #_getAll() {
        try {
            let query = this.query

        } catch (err) {
            return [err, null]
        }
    }

}
