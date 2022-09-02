import Pagination from "../lib/utils/Pagination";
import {TravelCategory} from "../models/travel/travel_categories.schema.";
import TravelTemplate from "../lib/utils/template/travel.template";
import {TravelCategoryController} from "./index";
import {BodyResponse} from "@handler";
import {ObjResolve} from "@yuyuid/utils";

export default class CategoryController {
    async all(req,res){
        try{

            const {page, limit, direction} = Pagination(req.query)

            return await TravelCategory.find({})
                .select("-about")
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                }).exec((err,category)=> {
                    if(!err){
                        return res.json({
                            error: false,
                            message: null,
                            query: {
                                limit,
                                page: page > 0 ? page : 1,
                                direction,
                            },
                            pagination: {
                                total_page: limit > 0 ? Math.ceil(category.length / limit) : 1,
                                current_page: page > 0 ? page : 1,
                                total_record: category.length,
                            },
                            data: category
                        })
                    }else{
                        return res.json({
                            error:true,
                            message: err.message,
                            data: null
                        })
                    }
                })
        }catch(err){
            return res.json({
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: []
            })
        }
    }

    async create(req,res){
        try{
            let { body } = req
            let fields = await new TravelTemplate({fields:body}).category()
            let categories = new TravelCategory({...fields})
            await categories.save()
            return res.json({
                status:200,
                error:false,
                message: "Successfully!",
                data:categories
            })
        }catch(err){
            return res.status(500).json({
                status:500,
                error:true,
                message: err.message,
                data:null
            })
        }
    }

    async detail(req,res){
        try{
            let { query , params } = req
            let { id } = params
            let condition = {}
            if(ObjResolve(query,'orderBy')){
                Reflect.set(condition,ObjResolve(query,'orderBy'),id)
            }else{
                Reflect.set(condition,"_id",id)
            }
            return await TravelCategory.findOne({...condition})
                .exec((err,category)=> {
                    if(!err){
                        return res.json(new BodyResponse({
                            error: false,
                            message: "Successfully",
                            data: category
                        }))
                    }else{
                        return res.json(new BodyResponse({
                            error:true,
                            message: err?.message ?? "Some Error",
                            data: null
                        }))
                    }
                })
        }catch(err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message ?? "Some Error",
                data: null
            }))
        }
    }

    async delete(req,res){
        try{
            let {id} = req.params
            await new TravelCategoryController().delete(id)

            return res.json({
                status:200,
                error:false,
                message: `Successfully Deleted ID ${id}!`,
                data:null
            })
        }catch(err){
            return res.json({
                status:500,
                error:true,
                message: err.message,
                data: null
            })
        }
    }
}
