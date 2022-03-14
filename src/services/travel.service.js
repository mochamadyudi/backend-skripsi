import {TravelLikes} from "../models/travel/travel_likes.schema";
import {Travel, TravelDiscuss} from "@yuyuid/models";
import BodyResponse from "../lib/handler/body-response";
import formidable from "formidable";
import {v2 as cloudinary} from "cloudinary";
import {HashId} from "@yuyuid/utils";
import YuyuidError from "@yuyuid/exception";


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
                .sort({name: query?.order ?? "asc", date: -1})
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
                    location = JSON.parse(fields?.location)
                    price = JSON.parse(fields?.price)
                    periods = JSON.parse(fields?.period)
                } catch (e) {
                    return next(e)
                }

                const generateSlug = await TravelService.GenerateSlug(travel_name)
                const checked = await TravelService.isExists('slug', travel_name)
                if (checked) throw YuyuidError.badData('Name is Exist!', checked)

                let newThumbnail = null

                try {
                    await cloudinary.uploader.upload(thumbnail?.filepath, {secure: true, transformation: [
                            {width: 150, height: 150, crop: "thumb"},
                            {radius: 20}
                        ]}, (error, result) => {
                        console.log(error,result)
                        if (!error) {
                            if(result && Object.keys(result).length > 0 ){
                                newThumbnail = {
                                    name: result?.name ?? null,
                                    original_filename: result?.original_filename ?? null,
                                    resource_type: result?.resource_type ?? null,
                                    format: result?.format ?? null,
                                    bytes: result?.bytes ?? null,
                                    prefix: result?.prefix ?? null,
                                    url: result?.url ?? null,
                                    public_id: result?.public_id ?? null,
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
                    thumbnail: {...newThumbnail},
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

    static async single(params) {
        try {
            const travel = await Travel.findOne({id: params?.id})
            // return [null,travel]
            return new BodyResponse({error: false, message: "Successfully!", data: travel})
        } catch (err) {
            return new BodyResponse({error: true, message: err.message})
            // return [err,null]
        }
    }

    static async isExists(type = 'slug', value) {
        const slug = await TravelService.GenerateSlug(value)

        switch (type) {
            case "slug":
                const data = await TravelService.TravelBySlug(slug)
                if(data) {
                    return {
                        error:true,
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
        console.log("GENERATE SLUG : ",data)
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
        const likes = await TravelLikes.findOne({id: id})
        return likes
    }

    static async getDiscuss(id) {
        const discuss = await TravelDiscuss.findOne({id: id})
        return discuss
    }


    static async addLikes() {
    }

    static async deleteLikes() {
    }
}
