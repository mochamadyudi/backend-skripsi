import { Router } from 'express'
import {BodyResponse} from "@handler";
import {Provinces} from "../../../models/locations/location-province.schema";
import {Regencies} from "../../../models/locations/location-regencie.schema";
import Pagination from "../../../lib/utils/Pagination";
import {Districts} from "../../../models/locations/location-district.schema";
import {Vilages} from "../../../models/locations/location-vilage.schema";
import LocationsController from "../../../controllers/locations.controller";

const route = Router()
export default (app)=> {
    app.use("/locations",route)

    route.post('/province', async (req,res)=> {
        try{
            return await Provinces.find({id: req.body?.id ?? null})
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    route.get('/province', async (req,res)=> {
        try{
            const {page, limit, direction} = Pagination(req.query)
            const count = await Provinces.find().count()
            return await Provinces.find()
                .limit(limit)
                .skip(limit * (page > 1 ? (page - 1): 0))
                .sort({
                    data: direction === "desc"?-1:1
                })
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: page > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
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
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    route.get('/province/search', async (req,res)=> {
        try{
            let q = req.query?.q ?? ""

            const {page, limit, direction} = Pagination(req.query)
            const count = await Provinces.find({name :{ $regex: '.*' + q.toUpperCase() + '.*' },$options: 'i' }).count()
            return await Provinces.find({name :{ $regex: '.*' + q.toUpperCase() + '.*' },$options: 'i' }  )
                .limit(limit)
                .skip(limit * (page > 1 ? (page - 1): 0))
                .sort({
                    data: direction === "desc"?-1:1
                })
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: page > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            message: null,
                            status:200,
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
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    route.get('/regencies', async (req,res)=> {
        try{
            let findParams = {}

            if(typeof(req.query?.province_id) !== "undefined"){
                findParams = {
                    province_id: req.query?.province_id
                }
            }

            const {page, limit, direction} = Pagination(req.query)
            const count = await Regencies.find(findParams).count()
            return await Regencies.find(findParams).populate()
                .limit(limit)
                .skip(limit * (page > 1 ? (page - 1): 0))
                .sort({
                    data: direction === "desc"?-1:1
                })
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            headers:JSON.stringify(req.cookies),
                            error:false,
                            message: null,
                            status:200,
                            findParams,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: page > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            headers:JSON.stringify(req.header),
                            message: null,
                            status:200,
                            findParams,
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
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    // route.get("/regencies/karawang", async ())
    route.get('/district', async (req,res)=> {
        try{
            let findParams = {}

            if(typeof(req.query?.regency_id) !== "undefined"){
                findParams = {
                    regency_id: req.query?.regency_id
                }
            }

            const {page, limit, direction} = Pagination(req.query)
            const count = await Districts.find(findParams).count()
            return await Districts.find(findParams).populate()
                .limit(limit)
                .skip(limit * (page > 1 ? (page - 1): 0))
                .sort({
                    data: direction === "desc"?-1:1
                })
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            headers:JSON.stringify(req.cookies),
                            error:false,
                            message: null,
                            status:200,
                            findParams,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: page > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            headers:JSON.stringify(req.header),
                            message: null,
                            status:200,
                            findParams,
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
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    route.get('/district/karawang', new LocationsController().getDistrictsKarawang)
    route.get('/villages', async (req,res)=> {
        try{
            let findParams = {}

            if(typeof(req.query?.district_id) !== "undefined"){
                findParams = {
                    district_id: req.query?.district_id
                }
            }

            const {page, limit, direction} = Pagination(req.query)
            const count = await Vilages.find(findParams).count()
            return await Vilages.find(findParams).populate()
                .limit(limit)
                .skip(limit * (page > 1 ? (page - 1): 0))
                .sort({
                    data: direction === "desc"?-1:1
                })
                .then((field)=> {
                    if(field){
                        return res.json( new BodyResponse({
                            headers:JSON.stringify(req.cookies),
                            error:false,
                            message: null,
                            status:200,
                            findParams,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: page > 0 ? Math.ceil(count / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: count,
                            },
                            data: field,
                        })).status(200)
                    }else{
                        return res.json( new BodyResponse({
                            error:false,
                            headers:JSON.stringify(req.header),
                            message: null,
                            status:200,
                            findParams,
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
                            data: null,
                        })).status(200)
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status:500,
            })).status(500)
        }
    })
    return app;
}
