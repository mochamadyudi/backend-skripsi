import {Travel, Villa, VillaLikes} from "@yuyuid/models";
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
import ResizeModule from "../lib/modules/resize.module";


export default class VillaService {

    constructor(props = {}) {
        this.req = props?.req ?? undefined
        this.res = props?.res ?? undefined
        this.fields = props?.fields ?? {}
        this.query = props?.query ?? {}
        this.id = props?.id ?? null
        this.orderBy = props?.orderBy ?? "_id"
        this.props = props ?? {}
    }

    /**
     * CREATE VILLA
     * @param payload
     * @returns {Promise<any|{data: null, error: boolean, message}>}
     */
    static async createVilla(payload) {
        try {
            // const likes = await VillaService.initialLikes()
            // const rates = await VillaService.initialRates()
            // const discuss = await VillaService.initialDiscuss()
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
                // likes: likes.id,
                // rates: rates.id,
                // discuss: discuss.id,
                user: payload.user,
                slug: payload?.slug ?? makeIdRandom(10),
                facility: {
                    ac: payload?.facility?.ac ?? false,
                    tv: payload?.facility?.tv ?? false,
                    hall: payload?.facility?.hall ?? false,
                    gazebo: payload?.facility?.gazebo ?? false,
                    wifi: payload?.facility?.wifi ?? false,
                    swimming_pool: payload?.facility?.swimming_pool ?? false,
                    parking: payload?.facility?.parking ?? false,
                    meeting_room: payload?.facility?.meeting_room ?? false,
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
                    return res.json(new BodyResponse({
                        error, message, status,
                        pagination, query,
                        data
                    }))
                }).catch(({data, error, message, status, pagination, query}) => {
                    console.log(err)
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

    static async getLikes(req,res){
        try{
            let { id } = req.params
            return await new VillaController()._getLikes(id,req.query)
                .then((val)=> {
                    return res.json({message:"success!"})
                })
                .catch((err)=> {
                    console.log(err)
                    return res.json({message: err.message})
                })
        }catch(err){
            return res.json({message: err.message})
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
            let files = {}
            if(typeof(req?.files) !== "undefined"){
                if (Array.isArray(req.files) && req.files.length > 0 ){
                    for(let i = 0;i< req.files.length;i++){
                        /**
                         * RESIZE [ 70, 50, 30 ]
                         */
                        let filename = req.files[i].filename.toString().toLowerCase().replace(/ /g,"-")
                        await new ResizeModule({
                            filename: filename,
                            destination: req.files[i].destination,
                            path:req.files[i].path,
                            resize: [80,50,30]
                        })
                        files = {
                            prefix_url:`${process.env.APP_URL}/public${req.files[i].destination.split("public")[1].replace(/\\/g,'/')}`,
                            originalname: req.files[i]?.originalname,
                            filename: filename,
                            resize_active: [80,50,30],
                            format: req.files[i]?.mimetype,
                            path: ['public',`${req.files[i].destination.split("public")[1].replace(/\\/g,'/')}`].join('')
                        }

                    }
                }
            }
            await Villa.findOneAndUpdate({user:req.user.id},{
                $set:{
                    thumbnail:files,
                }
            })
                .then((field)=> {
                    if(field){
                        return res.json(
                            new BodyResponse({
                                error:false,
                                message:"Successfully!",
                                status:200,
                                data: field,
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
        }catch(err){
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    }

    static async _addPhotos(req,res){
        try{
            let files = []
            if(typeof(req?.files) !== "undefined"){
                if (Array.isArray(req.files) && req.files.length > 0 ){
                    for(let i = 0;i< req.files.length;i++){
                        /**
                         * RESIZE [ 70, 50, 30 ]
                         */
                        let filename = req.files[i].filename.toString().toLowerCase().replace(/ /g,"-")
                        await new ResizeModule({
                            filename: filename,
                            destination: req.files[i].destination,
                            path:req.files[i].path,
                            resize: [80,50,30]
                        })
                        files.push({
                            prefix_url:`${process.env.APP_URL}/public${req.files[i].destination.split("public")[1].replace(/\\/g,'/')}`,
                            originalname: req.files[i]?.originalname,
                            filename: filename,
                            resize_active: [80,50,30],
                            format: req.files[i]?.mimetype,
                            path: ['public',`${req.files[i].destination.split("public")[1].replace(/\\/g,'/')}`].join('')
                        })
                    }
                }
            }

            await Villa.findOneAndUpdate({user:req.user.id},{
                $push:{
                    photos:files,
                }
            },{
                new:true,
                returnOriginal: false,
                returnNewDocument: true
            })
                .then((field)=> {
                    if(field){
                        return res.json(
                            new BodyResponse({
                                error:false,
                                message:"Successfully!",
                                status:200,
                                data: field,
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
        }catch(err){

        }
    }
    static async _deletePhoto(req,res){
        try{

        }catch(err){}
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



    static async checkVillaFoundByUser(id){
        try{
            return await Villa.findOne({
                user:id,
            })
                .then((result)=> {
                    console.log(result)
                    return [ null, result]
                })
                .catch((err)=> {
                    return [ err , null ]
                })
        }catch(err){
            return [ err, null ]
        }
    }


    async MyProfile(){
        try{
            return await Villa.findOne({
                [this.orderBy]: this.id
            }).populate("user", ["name","role", "avatar","email","firstName","lastName","username","avatar"])
                .populate({
                    path:"likes",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select:["likes"]
                })
                .populate({
                    path:"discuss",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path:"rates",
                    options: {
                        limit: 10,
                        sort: { date: -1},
                        skip: 0
                    },
                    select:["rates"]
                })
                .populate("user",["email","avatar","firstName","lastName","username"])
                .populate("locations.provinces",["name","id",'latitude','longitude','alt_name'])
                .populate("locations.districts",["name","id",'regency_id','latitude','longitude','alt_name'])
                .populate("locations.sub_districts",["name","id",'district_id','latitude','longitude'])
                .populate("locations.regencies",["name","id",'province_id','latitude','longitude','alt_name'])
                // .select("name social _id villa_type slug bio thumbnail description videos photos locations")
                .exec()
                .then((result)=> {
                    return [ null , result ]
                })
                .catch((err)=> {
                    return [ err, null ]
                })
        }catch(err){
            return [ err, null ]
        }
    }
    async updateProfile(){
        try{
            let fields = this.fields
            return await Villa.findOneAndUpdate(
                {[this.orderBy]: this.id},
                {
                    $set: {
                        ...fields,
                        is_verify: 1
                    }
                },
                {
                    rawResult:true,
                    new: true
                }
            )
                .then(({value})=> {
                    return [null , value]
                })
                .catch((err)=> {
                    return [ err, null]
                })

        }catch(err){
            return [ err , null ]
        }
    }
}
