import {Router} from "express";
import Pagination from "../../../../lib/utils/Pagination";
import {Villa,Travel} from "@yuyuid/models";
import moment from "moment";
import VillaService from "../../../../services/villa.service";

const route = Router()
export default (app)=> {
    app.use('/',route)
    route.get('/profile', async (req,res)=> {
        return res.json({error:false,message: "oK!"})
    })

    route.get("/search/:q", async (req,res)=> {
        try{
            let {q} = req.params

            const {page ,limit,direction} = Pagination(req.query)


            const villa = await Villa.find({ name: { $regex: '.*' + q + '.*' },$options: 'i' }).limit(limit)
                .skip(limit * (page > 1 ? page: 0))
                .populate("user", ["name","role", "avatar","email","firstName","lastName","username","avatar"])
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
                .select("name social _id villa_type slug bio thumbnail description videos photos locations")
                .sort({
                    date: direction === "desc"?-1:1
                })
            const count = await Villa.find({ name: { $regex: '.*' + q + '.*' },$options: 'i' }).count()

            return await res.json({
                error: false,
                message: null,
                query:{
                    limit,
                    page: page > 0  ? page : 1,
                    direction,
                },
                pagination: {
                    total_page: limit > 0 ? Math.ceil(count / limit) : 1,
                    current_page:page> 0 ? page : 1,
                },
                data: villa
            }).status(200)


        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500);
        }
    })

    route.get("/detail/:id", async (req,res)=> {
        try{
            const {id} = req.params
            const villa = await Villa.findOne({_id:id}).select("-__v")
                .populate("user", ["name","role", "avatar","email","firstName","lastName","username","avatar"])
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
                .select("name social _id villa_type slug bio thumbnail description videos photos locations")


            if(villa){
                return res.json({
                    error:false,
                    message: null,
                    data: {
                        ...villa?._doc,
                        created_at: moment(villa.date,"YYYY MM DD").format("YYYY MMMM DD LTS")
                    }
                })
            }else{
                return res.json({
                    error:false,
                    message: "Villa not found!",
                    data: null
                })
            }
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    route.get("/detail/slug/:slug", async (req,res)=> {
        try{
            let {slug} = req.params
            const villa = await Villa.findOne({slug})
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
                .populate("locations.provinces",["name","id",'latitude','longitude','alt_name'])
                .populate("locations.districts",["name","id",'regency_id','latitude','longitude','alt_name'])
                .populate("locations.sub_districts",["name","id",'district_id','latitude','longitude'])
                .populate("locations.regencies",["name","id",'province_id','latitude','longitude','alt_name'])
                // .select("name social _id villa_type slug bio thumbnail description videos photos locations")

            if(villa){
                return res.json({
                    error:false,
                    message: null,
                    data: villa,
                })
            }else{
                return res.json({
                    error:false,
                    message: "Villa not found!",
                    data: null
                })
            }
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.get('/promotion', VillaService.getVillaPromotion)

    route.get('/list', VillaService.getVilla)


    route.get('/list/near-me', async (req,res)=> {
        try{
            await Travel.find({
                locations:{
                    $near: {
                        $geometry:{
                            lat:req.body.lat,
                            lng:req.body.lng
                        },
                        $maxDistance: 5000
                    }
                }
            }).exec((err,travel)=> {
                if(err){
                    console.log(err)
                }
                if(travel){
                    console.log(travel)
                }
            })
        }catch(err){

        }
    })



}
