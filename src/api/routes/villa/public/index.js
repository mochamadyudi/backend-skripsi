import {Router} from "express";
import Pagination from "../../../../lib/utils/Pagination";
import {Villa} from "@yuyuid/models";
import moment from "moment";
import VillaService from "../../../../services/villa.service";

const route = Router()
export default (app)=> {
    app.use('/',route)
    route.get('/profile', async (req,res)=> {
        res.json({error:false,message: "oK!"})
    })

    route.get("/search/:q", async (req,res)=> {
        try{
            let {q} = req.params

            const {page ,limit,direction} = Pagination(req.query)


            const villa = await Villa.find({ name: { $regex: '.*' + q + '.*' },$options: 'i' }).limit(limit)
                .skip(limit * (page > 1 ? page: 0))
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

            if(villa){
                return res.json({
                    error:false,
                    message: null,
                    data: {
                        id: villa.id,
                        social: villa.social,
                        location: villa.location,
                        villa_type: villa.villa_type,
                        slug: villa.slug,
                        name: villa.name,
                        website: villa.website,
                        bio: villa.bio,
                        thumbnail: villa.thumbnail,
                        description: villa.description,
                        photos: villa.photos,
                        videos: villa.videos,
                        is_deleted: villa.is_deleted,
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

    route.get('/promotion', VillaService.getVillaPromotion)

    route.get('/list', VillaService.getVilla)




}
