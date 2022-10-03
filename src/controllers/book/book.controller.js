import {BodyResponse} from "@handler";
import BookingService from "../../services/booking/booking.service";
import YuyuidError from "@yuyuid/exception";
import { first } from 'lodash'

export default class BookController {
    async _create(req,res){
        try{
            console.log(req.user)
            Reflect.set(req.body,'user',req.user.id)
            const [err,data] = await new BookingService({
                fields: req.body
            }).addBook()

            if(err) throw YuyuidError.badData(first(err?.errors)?.message ?? err ?? "Some Error")
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data: data
            }))
        }catch(err){
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "some Error",
                data:null
            }))
        }
    }

    async lists(req,res){
        try{
            const [err, data] = await new BookingService({
                query:req.query,
                id: req.user.id,
                orderBy: 'user'
            }).lists()

            if(err) throw YuyuidError.badData(first(err?.errors)?.message ?? err ?? "Some Error")
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                data: data
            }))
        }catch (err){
            return res.json(new BodyResponse({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null
            }))
        }
    }
}