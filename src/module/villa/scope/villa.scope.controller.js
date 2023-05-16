import express, {Request,Response} from 'express'
import {BodyResponse} from "@handler";
import VillaScopeService from "./villa.scope.service";
import {ObjResolve} from "@yuyuid/utils";
export default class VillaScopeController {
    constructor() {
    }

    async list(){

    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<e.Response>}
     */
    async profile(req,res){
        try{
            const [ err, data ] = await new VillaScopeService({
                user:req.user
            }).profile()

            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    status:400,
                    message: err?.message ?? err ?? "Bad Request"
                }))
            }

            res.status(!data ? 404 : 200);
            return res.json(new BodyResponse({
                status: !data?404:200,
                message: !data? "Villa not found": "Successfully",
                data
            }))

        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                status:500,
                message: err?.message
            }))
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<e.Response>}
     */
    async photos(req,res){
        try{
            const [ err, data ] = await new  VillaScopeService({
                query: req.query,
                user:req.user,
                req
            }).photos()

            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    status:400,
                    message: err?.message ?? err ?? "Bad Request"
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                ...data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                status:500,
                message: err?.message
            }))
        }
    }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<e.Response>}
     */
    async uploadPhotos(req,res){
        try{
            if(typeof(req.file) === 'undefined' || req.file === null) {
                res.status(400)
                return res.json(new BodyResponse({
                    error: true,
                    status:400,
                    message: "File must be defined!"
                }))
            }
            Reflect.set(req.file,'path',['/public',req.file.path.split('/public')[1]].join(''))
            const [err,data] = await new VillaScopeService({
                fields: {
                    ...req.file,
                    villaId:req.user.villaId
                }
            }).AddPhotos();

            if(err){
                res.status(400);
                return res.json(new BodyResponse({
                    error:false,
                    status:400,
                    message: err?.message ?? "Bad Request"
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully added photos",
                data: data
            }))
        }catch(err){
            res.status(500)
            return res.json(new BodyResponse({
                status:500,
                message: err?.message
            }))
        }
    }


    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<e.Response>}
     * @constructor
     */
    async DeletePhoto(req,res){
        try{
            const [ err, data ] = await new VillaScopeService({
                id: req.params.id,
                orderBy: ObjResolve(req.query,'orderBy') ?? "_id"
            }).deletePhotos()

            if(err && !data){
                res.status(404);
                return res.json(new BodyResponse({
                    status:404,
                    error: true,
                    message: err?.message ?? "Some Error"
                }))
            }
            if(err && data){
                res.status(404)
                return res.json(new BodyResponse({
                    error: true,
                    status:404,
                    message: err?.message ?? "Photos Not found"
                }))
            }

            res.status(201);
            return res.json(new BodyResponse({
                status:201,
                error:false,
                message : "Successfully deleted!"
            }))
        }catch(err){
            res.status(500);
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err?.message ?? "Some Error"
            }))
        }
    }


}