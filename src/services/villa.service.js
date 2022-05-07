import {Travel, Villa} from "@yuyuid/models";
import YuyuidError from "@yuyuid/exception";
import {
    changeFileName,
    makeIdRandom,
    MulterPathImagesWithHasId, pathUploadedByDate,
    PathWithYMD,
    uploadImageWithHashFolder
} from "@yuyuid/utils";
import VillaController from "../controllers/villa.controller";
import {BodyResponse} from '@yuyuid/handler'
import {VillaLikes} from "../models/villa/travel_likes.schema";
import {VillaDiscuss} from "../models/villa/villa_discuss.schema";
import {VillaRates} from "../models/villa/villa_rates.schema";
import formidable from "formidable";
import mv from "mv";
import ImagesChecker from "../lib/utils/images-checker";
// var im = require('imagemagick');
import im from 'imagemagick'
import fs from 'fs'
import gm from 'gm'
import {thumbnail} from "easyimage";
import Jimp from 'jimp'
import moment from "moment";
import path from "path";


export default class VillaService {

    /**
     * CREATE VILLA
     * @param payload
     * @returns {Promise<any|{data: null, error: boolean, message}>}
     */
    static async createVilla(payload) {
        try {
            const likes = await VillaService.initialLikes()
            const rates = await VillaService.initialRates()
            const discuss = await VillaService.initialDiscuss()
            //    rates:{
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref:"villa_rates"
            //     },
            //     likes: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref:"villa_likes"
            //     },
            //     discuss:{
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref:"villa_discuss"
            //     },
            const villa = new Villa({
                ...payload,
                likes: likes.id,
                rates: rates.id,
                discuss: discuss.id,
                user: payload.user,
                slug: makeIdRandom(10),
                facility: {
                    ac: false,
                    tv: false,
                    hall: false,
                    gazebo: false,
                    wifi: false,
                    swimming_pool: false,
                    parking: false,
                    meeting_room: false,
                }
            });
            await villa.save()
            return villa;
        } catch (err) {
            return {
                error: true,
                message: err.message,
                data: null,
            }
        }
    }

    static async updateVilla(id, payload = {}) {
        try {
            const newVilla = await Villa.findOneAndUpdate(
                {_id: id},
                {$set: {
                    ...payload,
                        is_update:true
                    }},
                {new: true}
            )
                .populate("user", ["name", "role", "avatar", "email", "firstName", "lastName", "username", "avatar"])
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
            return new BodyResponse({
                error: false,
                message: null,
                data: newVilla
            })
        } catch (err) {
            return new BodyResponse({
                error: true,
                message: err.message
            })
        }
    }

    /**
     *
     * @returns {Promise<BodyResponse>}
     * @param req
     * @param res
     */
    static async getVilla(req, res) {
        try {
            await new VillaController()._get(null, {query: req.query, params: req.params})
                .then(({data, error, message, status, pagination, query}) => {
                    return res.json({
                        error, message, status,
                        pagination, query,
                        data
                    })
                }).catch(({data, error, message, status, pagination, query}) => {
                    return res.json({
                        error, message, status,
                        pagination: pagination ?? null,
                        query: query ?? null,
                        data
                    })
                })

        } catch (err) {
            return new BodyResponse({error: true, message: err.message})
        }
    }

    /**
     * GET DETAIL VILLA
     * @param req
     * @param res
     * @returns {Promise<BodyResponse>}
     */
    static async getDetail(req, res) {
        try {
            const {id} = req.params
            return res.json({
                ...await new VillaController()._get(id, {query: req.query})
            })
        } catch (err) {
            return new BodyResponse({error: true, message: err.message})
        }
    }

    static async getVillaTop10() {

    }

    static async getVillaPromotion(req, res) {
        try {

        } catch (err) {

        }
    }


    static async _putThumbnail(req,res){
        try{
            var form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                var oldpath = files.thumbnail.filepath;

                const villa = await Villa.findOne({user:req.user.id})

                const {extension,status} = await ImagesChecker.mimeType(files.thumbnail.mimetype)
                // console.log({extension,status,files})
                if (status) {
                    let filename = changeFileName(files.thumbnail.originalFilename.toString().toLowerCase().replace(/ /g, "_"), extension)
                    const {prefix_date, path_full,only_date} = pathUploadedByDate(filename)

                    // console.log(dates.join("/"))
                    mv(oldpath,path_full , function (err) {
                        if (err) throw err;
                    })

                    // return res.json({
                    //     error:false,
                    //     message:"successfully!",
                    //     data:path_full,
                    //     prefix_date
                    // })

                    // im.identify(['-format', '%wx%h', filePath], function(err, output){
                    //     if (err) throw err;
                    //     console.log('dimension: '+output);
                    //     // dimension: 3904x2622
                    // });
                    // const thumbnailInfo = await thumbnail({
                    //     src: filePath,
                    //     width: 100,
                    //     height: 100,
                    // });
                    // console.log({thumbnailInfo})
                    await Villa.findOneAndUpdate(
                        {user:req.user.id},
                        {
                            $set:{
                                thumbnail: {
                                    prefix:`/public/uploads`,
                                    url:`${prefix_date}/${filename}`
                                }
                            }
                        },
                        {new:true})
                        .then((field)=> {
                            if(field){
                                return res.json(
                                    new BodyResponse({
                                        error:true,
                                        message:"Successfully!",
                                        status:200,
                                        data: field,
                                        only_date
                                    })
                                ).status(200)
                            }else{
                                return res.json(
                                    new BodyResponse({
                                        error:true,
                                        message:"Not found!",
                                        status:200,
                                        data: null
                                    })
                                ).status(200)
                            }
                        })
                        .catch((err)=> {
                            return res.json(
                                new BodyResponse({
                                    error:true,
                                    message:err.message,
                                    status:500,
                                    data:null
                                })
                            ).status(500)
                        })
                }
            });

        }catch(err){
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    }


    static async initialLikes() {
        const likes = new VillaLikes({})
        await likes.save()
        return {id: likes.id}
    }

    static async initialDiscuss() {
        const discuss = new VillaDiscuss({})
        await discuss.save()
        return {id: discuss.id}
    }

    static async initialRates() {
        const discuss = new VillaRates({})
        await discuss.save()
        return {id: discuss.id}
    }


}
