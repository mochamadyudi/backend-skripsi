import {TravelLikes} from "../models/travel/travel_likes.schema";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import BodyResponse from "../lib/handler/body-response";
import formidable from "formidable";
import {v2 as cloudinary} from "cloudinary";
import {HashId} from "@yuyuid/utils";
import YuyuidError from "@yuyuid/exception";
import Pagination from "../lib/utils/Pagination";
import {TravelCategory} from "../models/travel/travel_categories.schema.";


export class TravelService {
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

            const {id} = req.params
            await Travel.findById({_id: id})
                .populate('categories.category', ['name', 'slug', 'is_published', 'about', 'createdAt', 'hash_id'])
                .populate('locations.districts', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                .populate('locations.provinces', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                .populate('locations.regencies', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                .populate('locations.sub_districts', ['name', 'alt_name', 'latitude', 'longitude', 'id', '_id'])
                .then(async (field) => {
                    const likes = await TravelLikes.findOne({travel: field.id}).select("-__v -_id -travel -date").populate('likes.user', ['firstName', 'avatar', 'lastName', 'email', 'is_verify'])
                    const discuss = await TravelDiscuss.findOne({travel: field.id}).select("-__v -_id -travel -date").populate('discuss.user', ['firstName', 'avatar', 'lastName', 'email', 'is_verify'])

                    if (field) {
                        await Travel.findOneAndUpdate({_id: id}, {$set: {seen: field.seen + 1},}, {new: true})

                        return res.json({
                            error: false,
                            message: "Successfully!",
                            data: {
                                ...field._doc,
                                likes: typeof (likes?.likes) !== "undefined" ? likes.likes : [],
                                discuss: typeof (discuss?.discuss) !== "undefined" ? discuss?.discuss : []
                            },

                        }).status(200)
                    } else {
                        return res.json({
                            error: true,
                            message: `Travel ${id} not found!`,
                            data: null,
                            likes: [],
                            discuss: []
                        }).status(200)
                    }


                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: err.message,
                        data: null,
                        likes: [],
                        discuss: []
                    }).status(200)
                })


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
        const discuss = await TravelDiscuss.findOne({travel: id}).populate("discuss.user", ["firstName", "lastName", "email", "avatar"])
        return discuss === null ? [] : typeof (discuss?.discuss) !== "undefined" ? discuss?.discuss : []
    }

    static async GetLikes(id) {
        const likes = await TravelLikes.findOne({travel: id}).populate("likes.user", ["firstName", "lastName", "email", "avatar"])
        return likes === null ? [] : typeof (likes?.likes) !== "undefined" ? likes?.likes : []
    }


    static async _getTravelLists(req, res) {
        try {
            const {page, limit, direction} = Pagination(req.query)
            let obj = {}

            if (typeof(req.query?.taxonomy) === "undefined" || req.query?.taxonomy === null){
                obj = {
                    'categories.slug': {
                        $ne : null
                    }
                }
            }else{
                obj = {
                    'categories.slug': {
                        "$exists": true,
                        $in: req.query?.taxonomy,
                        $regex: '.*'+ req.query?.taxonomy + "*.",
                        $options: "i"
                    }
                }
            }

            const count = await Travel.find({...obj}).count()
            await Travel.find({...obj}).populate("categories.category", ['slug', 'name', 'is_verify', 'is_published'])
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .exec(async function (err, field) {

                    if (!err) {
                        let data = []
                        if (Array.isArray(field)) {
                            for (let i = 0; i < field.length; i++) {
                                let item = field[i]
                                const discuss = await TravelService.GetDiscuss(item._id)
                                const likes = await TravelService.GetLikes(item._id)

                                data.push({
                                    ...item._doc,
                                    discuss,
                                    likes
                                })

                            }
                        }

                        return res.json({
                            error: false,
                            message: null,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: limit > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: data
                        })
                    }
                })


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
