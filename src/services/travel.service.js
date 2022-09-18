import {TravelLikes} from "../models/travel/travel_likes.schema";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import BodyResponse from "../lib/handler/body-response";
import formidable from "formidable";
import {v2 as cloudinary} from "cloudinary";
import {HashId, ObjResolve} from "@yuyuid/utils";
import YuyuidError from "@yuyuid/exception";
import {first} from 'lodash'
import Pagination from "../lib/utils/Pagination";
import {TravelCategory} from "../models/travel/travel_categories.schema.";
import {ObjectId} from "mongodb";


export class TravelService {
    constructor(props = {}) {
        this.query = props?.query ?? {}
    }

    static async constructTravel() {
    }

    static async all(query) {
        try {
            const page = query.current ? parseInt(query.current) : 1;
            const limit = query.limit ? parseInt(query.limit) : 20;
            const skipIndex = (page - 1) * limit;
            const travelCount = await Travel.count()
            const travel = await Travel.find({})
                .sort({name: query.order ?? "asc", date: -1})
                .limit(limit)
                .skip(skipIndex)
                .exec();

            const data = {
                total: travelCount,
                total_page: Math.floor(travelCount / limit) + 1,
                page: page,
                limit,
                data: travel
            }

            return [null, data]
        } catch (e) {
            return [e, null]
        }
    }

    static async create(req, res, next) {
        try {
            const form = new formidable.IncomingForm()
            await form.parse(req, async function (err, fields, files, end) {
                const {
                    travel_name,
                    facility,
                    bio,
                } = fields


                const {thumbnail} = files
                let location = {}
                let periods = {}
                let price = {}
                try {
                    location = JSON.parse(fields.location)
                    price = JSON.parse(fields.price)
                    periods = JSON.parse(fields.period)
                } catch (e) {
                    return next(e)
                }

                const generateSlug = await TravelService.GenerateSlug(travel_name)
                const checked = await TravelService.isExists('slug', travel_name)
                if (checked) throw YuyuidError.badData('Name is Exist!', checked)

                let newThumbnail = null

                try {
                    await cloudinary.uploader.upload(thumbnail.filepath, {
                        secure: true, transformation: [
                            {width: 150, height: 150, crop: "thumb"},
                            {radius: 20}
                        ]
                    }, (error, result) => {
                        console.log(error, result)
                        if (!error) {
                            if (result && Object.keys(result).length > 0) {
                                newThumbnail = {
                                    name: result.name ?? null,
                                    original_filename: result.original_filename ?? null,
                                    resource_type: result.resource_type ?? null,
                                    format: result.format ?? null,
                                    bytes: result.bytes ?? null,
                                    prefix: result.prefix ?? null,
                                    url: result.url ?? null,
                                    public_id: result.public_id ?? null,
                                }
                            }
                            next(error)
                        }
                    });
                } catch (e) {
                    return next(e)
                }

                const travel = new Travel({
                    travel_name,
                    hash_id: HashId({count: 20}),
                    slug: generateSlug,
                    thumbnail: newThumbnail,
                    photo: [],
                    video: [],
                    facility,
                    bio,
                    location,
                    periods,
                    price,
                    is_deleted: false,
                })
                await travel.save()
                return res.status(200).json(new BodyResponse({error: false, success: true, data: travel}))

            })
        } catch (err) {

            return res.status(500).json(new BodyResponse({error: true, message: err.message}))
        }
    }

    static async update(req, res, next) {
        try {

        } catch (err) {
            return next(err)
        }

    }

    static async delete() {
    }

    static async single(req, res) {
        try {

            let {query, params} = req

            const {keyword} = params
            let doc = await Travel.findOne({[ObjResolve(query, 'orderBy') ?? "_id"]: keyword})
                // .populate('categories', ['name', 'slug', 'is_published', 'about', 'createdAt', 'hash_id'])
                // .populate('locations.districts', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                // .populate('locations.provinces', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                // .populate('locations.regencies', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                // .populate('locations.sub_districts', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                .exec()
            doc = doc?._doc ?? doc
            if (doc) {

                let data = {
                    ...doc
                }
                if (ObjResolve(query, 'type') === "get") {
                    await Travel.findOneAndUpdate({_id: doc?._id}, {$inc: {seen: 1}}, {new: true})
                }
                let likes = await TravelLikes.findOne({travel: doc?._id})
                    .select("-__v -_id -travel -date")
                    .populate('likes.user', ['firstName', 'avatar', 'lastName', 'email', 'is_verify'])
                let discuss = await TravelDiscuss.aggregate([
                    {
                        $match: {
                            travel: doc?._id
                        }
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
                        $set: {
                            user: {$arrayElemAt: ["$user", 0]}
                        }
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true
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
                        $set: {
                            "user.profiles": {$arrayElemAt: ["$user.profiles", 0]}
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
                            _id: {$cond: ['$parentDiscussId', '$parentDiscussId', '$_id']},
                            'user.profiles.thumbnail': 1,
                            'user.profiles.photos': 1,
                            'user._id': 1,
                            'user.email': 1,
                            'user.firstName': 1,
                            'user.lastName': 1,
                            likes: 1,
                            dislikes: 1,
                            is_updated: 1,
                            is_hidden: 1,
                            date: 1,
                            comment: 1,
                            parentDiscussId: {$ifNull: ['$parentDiscussId', "$parentDiscussId", '$parentDiscussId']},
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            user: {
                                $first: "$user",
                            },
                            comment: {$min: {$cond: ['$parentDiscussId', "$comment", "$comment"]}},
                            count_replies: {$sum: 1},
                            replies: {
                                $push: {
                                    $cond: ['$parentDiscussId', "$$ROOT", '$$REMOVE']
                                }
                            },
                        },
                    }

                ]).exec()
                // .select("-__v -_id -travel -date")
                // .populate({
                //     path:'user',
                //     select:"role email firstName lastName username avatar"
                // })
                Reflect.set(data, 'discuss', discuss)
                Reflect.set(data, 'likes', likes)
                return res.json(new BodyResponse({
                    error: false,
                    status: 200,
                    message: "Successfully!",
                    data: data
                }))
            } else {
                return res.json({
                    error: true,
                    message: "Data Not found!",
                    data: null,
                    likes: [],
                    discuss: []
                }).status(500)
            }

        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null,
                likes: [],
                discuss: []
            }).status(500)
        }
    }

    static async isExists(type = 'slug', value) {
        const slug = await TravelService.GenerateSlug(value)

        switch (type) {
            case "slug":
                const data = await TravelService.TravelBySlug(slug)
                if (data) {
                    return {
                        error: true,
                        data,
                    }
                }
                break;
            default:
                return false;
        }

    }

    static async GenerateSlug(val) {
        const data = val.toString().toLowerCase().replace(/ /g, '-')
        console.log("GENERATE SLUG : ", data)
        return data
    }


    static async TravelBySlug(slug) {
        try {
            const data = await Travel.findOne({slug})
            console.log("travel by slug", data)
            return data
        } catch (err) {

        }
    }


    /**
     *
     * @returns {Promise<void>}
     */
    static async firstCreatLikes(id) {
        try {
            const likes = new TravelLikes({travel: id})
            await likes.save()
            return [null, likes]
        } catch (e) {
            return [e, null]
        }
    }

    static async firstCreateDiscuss(id) {
        try {
            const discuss = new TravelDiscuss({travel: id})
            await discuss.save()
            return [null, discuss]
        } catch (e) {
            return [e, null]
        }
    }


    static async getLikes(id) {
        const likes = await TravelLikes.findOne({travel: id})
        return likes
    }

    static async getDiscuss(id) {
        const discuss = await TravelDiscuss.findOne({travel: id})
        return discuss
    }


    static async _addLikes(req, res) {
        try {

            const {user} = req.body
            const {id} = req.params

            const travel = await TravelLikes.findOne({travel: id}).populate("likes.user", ["email", "firstName", "lastName"])

            if (travel) {
                //Check if post has already been liked by user
                if (
                    travel.likes.filter(like => like.user?._id.toString() === user).length > 0
                ) {
                    return res
                        .status(200)
                        .json({
                            error: true,
                            message: "Already liked by this user",
                            data: travel
                        });
                }
                travel.likes.unshift({user})
                //puts it on the beginning
                // room.wishList.unshift({user: req.user.id});
                // await room.save();

                await travel.save()
                // res.json(room.wishList);


                return res.json({
                    error: false,
                    message: "halloooo",
                    data: travel
                })
            } else {
                const getTravel = await Travel.findById({_id: id})
                if (getTravel) {
                    const newTravel = await new TravelLikes({
                        travel: id
                    }).save()

                    newTravel.likes.unshift({user})
                    //newTravel it on the beginning
                    // room.wishList.unshift({user: req.user.id});
                    // await room.save();

                    await newTravel.save()
                    // res.json(room.wishList);


                    return res.json({
                        error: false,
                        message: "newTravel",
                        data: newTravel
                    }).status(200)
                    // return res
                    //     .status(200)
                    //     .json({
                    //         error: true,
                    //         message: `Travel ${id} not found!`,
                    //         data: newTravel
                    //     });
                } else {
                    return res
                        .status(200)
                        .json({
                            error: true,
                            message: `Travel ${id} not found!`,
                            data: null
                        });
                }


            }

        } catch (err) {

            return res
                .status(500)
                .json({
                    error: true,
                    message: err.message,
                    data: null
                });
        }
    }

    static async deleteLikes() {
    }


    static async GetDiscuss(id) {
        const discuss = await TravelDiscuss.findOne({travel: id})
        // .populate("discuss.user", ["firstName", "lastName", "email", "avatar"])
        return discuss === null ? [] : typeof (discuss?.discuss) !== "undefined" ? discuss?.discuss : []
    }

    static async GetLikes(id) {
        const likes = await TravelLikes.findOne({travel: id}).populate("likes.user", ["firstName", "lastName", "email", "avatar"])
        return likes === null ? [] : typeof (likes?.likes) !== "undefined" ? likes?.likes : []
    }


    async getList() {
        try {
            let query = this.query
            const {page, limit, direction} = Pagination(query)
            let condition = [
                {
                    $lookup: {
                        from: 'travel_categories', // change your original collection name
                        localField: 'categories',
                        foreignField: '_id',
                        as: 'categories'
                    }
                },
                {
                    $lookup: {
                        from: 'location_provinces', // change your original collection name
                        localField: 'locations.provinces',
                        foreignField: '_id',
                        as: 'locations.provinces'
                    }
                },
                {
                    $lookup: {
                        from: 'location_districts', // change your original collection name
                        localField: 'locations.districts',
                        foreignField: '_id',
                        as: 'locations.districts'
                    }
                },
                {
                    $lookup: {
                        from: 'location_regencies', // change your original collection name
                        localField: 'locations.regencies',
                        foreignField: '_id',
                        as: 'locations.regencies'
                    }
                },
                {
                    $lookup: {
                        from: 'location_vilages', // change your original collection name
                        localField: 'locations.sub_districts',
                        foreignField: '_id',
                        as: 'locations.sub_districts'
                    }
                },

                {
                    $set:{
                        'locations.districts': {$arrayElemAt: ["$locations.districts",0]},
                        'locations.provinces': {$arrayElemAt: ["$locations.provinces",0]},
                        'locations.regencies': {$arrayElemAt: ["$locations.regencies",0]},
                        'locations.sub_districts': {$arrayElemAt: ["$locations.sub_districts",0]}
                    }
                },


            ]

            if (ObjResolve(query, 'taxonomy')) {
                if (Array.isArray(ObjResolve(query, 'taxonomy')) && ObjResolve(query, 'taxonomy').length > 0) {
                    condition.push({
                        $match: {
                            "categories.slug": {
                                $in: ObjResolve(query, 'taxonomy')
                            }
                        }
                    })
                } else {
                    condition.push({
                        $match: {
                            "categories.slug": ObjResolve(query, 'taxonomy')
                        }
                    })
                }

            }
            if (ObjResolve(query, 'notIn')) {
                if (Array.isArray(ObjResolve(query, 'notIn')) && ObjResolve(query, 'notIn').length > 0) {
                    let NotIn = []
                    for(let i = 0; i < ObjResolve(query, 'notIn').length;i++){
                        NotIn.push(
                            new ObjectId(ObjResolve(query, 'notIn')[i]),
                        )
                    }
                    condition.push({
                        $match: {
                            "_id": {
                                $nin: NotIn
                            }
                        }
                    })
                } else {
                    condition.push({
                        $match: {
                            "_id": {
                                $ne:ObjResolve(query, 'notIn')
                            }
                        }
                    })
                }

            }


            condition.push({
                '$facet': {
                    metadata: [{$count: "total_record"}, {$addFields: {page:page,limit:limit,offset:limit * (page > 1 ? page - 1 : 0) }}],
                    data: [{$skip: limit * (page > 1 ? page - 1 : 0)}, {$limit: limit}] // add projection here wish you re-shape the docs
                }
            })
            condition.push({
                $set:{
                    "metadata": {$arrayElemAt: ["$metadata",0]}
                }
            })

            const data = await Travel.aggregate(condition).exec()

            return [null, first(data)]

        } catch (err) {
            return [err, null]
        }
    }

    static async _getTravelLists(req, res) {
        let {query} = req
        try {
            const [err, data] = await new TravelService({query: req.query}).getList()

            if (err) throw YuyuidError.badImplementation(first(err?.errors)?.message ?? "Some Error")

            return res.json(new BodyResponse({
                status: 200,
                error: false,
                message: "Successfull!",
                ...data
            }))
            // const {page, limit, direction} = Pagination(query)
            // let obj = {}
            // console.log(query.taxonomy)

            // if(ObjResolve(query,'taxonomy')){
            // //
            //     Reflect.set(obj,'categories.slug', {
            //         $exists:true,
            //         $eq:ObjResolve(query,'taxonomy'),
            //         // $regex: '.*'+query.taxonomy+"*.",
            //         // $options: "i"
            //     })
            // }


            // if(typeof(query?.notIn) !== "undefined"){
            //     Reflect.set(obj,"_id",{$ne:query?.notIn})
            // }

            // console.log({query,obj})
            // const count = await Travel.find({...obj}).count()

            // return await Travel.find({...obj})
            //     .populate({
            //         path:"categories",
            //         select: "_id name is_published slug about",
            //         // match:{
            //         //     slug: {
            //         //         $eq: ObjResolve(query,'taxonomy')
            //         //     }
            //         //     // _id:'6321f5d79637bbd9318cb348'
            //         //
            //         // }
            //     //    "categories", {
            //         //
            //         //                 }, ["_id",'name','is_published','slug','about']
            //     })
            //     .limit(limit)
            //     .skip(limit * (page > 1 ? page - 1 : 0))
            //     .sort({
            //         date: direction === "desc" ? -1 : 1
            //     })
            //     .exec(async function (err, field) {
            //         if (!err) {
            //             let data = []
            //             if (Array.isArray(field)) {
            //                 for (let i = 0; i < field.length; i++) {
            //                     let item = field[i]?._doc
            //                     const discuss = await TravelService.GetDiscuss(item._id)
            //                     const likes = await TravelService.GetLikes(item._id)
            //                     // if(typeof(item?.categories) !== "undefined"){
            //                     //     if(Array.isArray(item?.categories) && item.categories.length > 0){
            //                     //         let Categories = []
            //                     //         for(let k = 0 ; k < item?.categories?.length; k ++){
            //                     //             let cat = (item?.categories[k])?.toJSON()
            //                     //             Reflect.set(item?.categories[k],'about',cat?.about)
            //                     //             Reflect.set(item?.categories[k],'categoryId',cat?.category?._id)
            //                     //             Reflect.set(item?.categories[k],'is_published',typeof(cat?.category?.is_published) === "number" ? cat?.category?.is_published > 0 : cat?.category?.is_published)
            //                     //             Reflect.deleteProperty(item?.categories[k],'category')
            //                     //             Categories.push({
            //                     //                 ...cat
            //                     //             })
            //                     //         }
            //                     //         Reflect.set(item, "categories",Categories)
            //                     //     }
            //                     // }
            //                     data.push({
            //                         ...item,
            //                         discuss,
            //                         likes
            //                     })
            //
            //                 }
            //             }
            //
            //             return res.json({
            //                 error: false,
            //                 message: null,
            //                 query: {
            //                     limit,
            //                     page: page > 0 ? page : 1,
            //                     direction,
            //                 },
            //                 pagination: {
            //                     total_page: limit > 0 ? Math.ceil(count / limit) : 1,
            //                     current_page: page > 0 ? page : 1,
            //                     total_record: count,
            //                 },
            //                 data: data
            //             })
            //         }
            //     })

            // if(typeof(req.query.taxonomy) !== "undefined"){
            //     if(req.query.taxonomy === "recomendation" || req.query.taxonomy === "top-10"){
            //         travel
            //             .where('seen')
            //             .gt(req.query.taxonomy === "recomendation" ? 40 : 250)
            //     }
            // }


        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    }


    static async _deleteTravelById(req, res) {
        try {
            const {id} = req.params
            await TravelDiscuss.findOneAndRemove({travel: id})
            await TravelLikes.findOneAndRemove({travel: id})
            await Travel.findOneAndRemove({_id: id})
                .then((field) => {
                    if (field) {
                        return res.json({
                            error: false,
                            message: `Successfully! deleted Travel by id ${field?.travel_name}`,
                            data: null
                        })
                    } else {
                        return res.json({
                            error: true,
                            message: `Error! deleted Travel by id ${id}`,
                            data: null
                        })
                    }
                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: `Error! deleted Travel by id ${id}`,
                        data: null
                    })
                })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    }


}
