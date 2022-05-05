import {Router} from "express";
import {User} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {isAdmins} from "../../../middlewares/auth";
import {Villa} from "../../../../models/villa/villa.schema";


const route = Router()

export default (app)=> {
    app.use('/villa',route)

    app.use(isAdmins)

    route.delete("/delete/:id", async (req,res)=> {
        try{

            const {id} = req.params
            await User.findOneAndRemove({id})

            return res.json({
                error:false,
                message:`Successfully! deleted Account ID ${id}`,
            }).status(200)

            // return res.json({
            //     error:;
            // })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    route.get('/list', async (req,res)=> {
        try{
            //entrants.find({ pincode: { $ne: null } })
            let obj = {}


            if(typeof(req.query?.is_new) !== "undefined"){
                console.log(req.query?.is_new)
                if(req.query.is_new === "1"){
                    obj = {
                        "$exists": true,

                    }
                }else{
                    obj = {
                        "$exists": true,
                        "$ne": null
                    }
                }
            }else{
                obj = {
                    "$exists": true,
                }
            }

            const {page ,limit,direction} = Pagination(req.query)
            const user = await Villa.find({updated_at: { ...obj}}).limit(limit)
                .skip(limit * (page > 1 ? page - 1: 0))
                .sort({
                    date: direction === "desc"?-1:1
                })


            const count = await Villa.find({updated_at: { ...obj}}).count()


            return res.json({
                error:false,
                message:null,
                query:{
                    limit,
                    page: page > 0  ? page : 1,
                    direction,
                },
                pagination: {
                    total_page: limit > 0 ? Math.ceil(count / limit) : 1,
                    current_page:page> 0 ? page : 1,
                    total_record:count,
                },
                data: user
            })

            // return res.json({
            //     error:;
            // })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500)
        }
    })


}
