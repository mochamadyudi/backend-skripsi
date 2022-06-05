import {Router} from 'express'
import {BodyResponse} from "@handler";
import {isAuth} from "../../../middlewares/auth";
import {Room} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
export default ()=> {
    const app = Router()
    app.use(isAuth)

    app.get('/list', async (req,res)=> {
        try{
            const {page, limit, direction} = Pagination(req.query)
            const count = await Room.find().count()
            await Room.find()
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .then((field)=> {
                    if(field){
                        return res.json(new BodyResponse({
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
                            data: field
                        }))
                    }else{
                        return res.json(new BodyResponse({
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
                            data: []
                        }))
                    }
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        error: true,
                        message: err.message,
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
                        data: []
                    }))
                })
            // Room


        }catch(err){
            return res.json(new BodyResponse({
                ...err,
                error:true,
                message: err.message,
                data: null,
                status:500
            })).status(500)
        }
    })

    app.get('/list/:id', async (req,res)=> {
        try{
            const {id} = req.params
            return await Room.find({id})
                .populate('schedule', ['id', 'schedule','rooms'])
                .then((field)=> {
                    if(field){
                        return res.json(new BodyResponse({
                            error:false,
                            message: null,
                            data: field[0],
                            status:200
                        })).status(200)
                    }else{
                        return res.json(new BodyResponse({
                            error:false,
                            message: "data not found!",
                            data: null,
                            status:200
                        })).status(200)
                    }
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        error:true,
                        message: err.message,
                        data: null,
                        status:500
                    })).status(500)
                })
        }catch (err){
            return res.json(new BodyResponse({
                error:true,
                message: err.message,
                status: 500
            })).status(500)
        }
    })
    return app;
}
