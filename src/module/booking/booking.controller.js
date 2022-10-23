import {Request, Response} from "express";
import {BodyResponse} from "@handler";
import {_MBooking} from "@Modules";
import YuyuidError from "@yuyuid/exception";
import {UserService} from "@yuyuid/services";
import {YuyuidEmitter} from "@yuyuid/utils";
import {YuyuidEvent} from "@yuyuid/constants";
import RoomsService from "../../services/rooms.service";

export default class BookingController {
    constructor(height, width) {

    }

    async _list(req, res) {
        try{
            const [err, data] = await new _MBooking.Module({query:req.query, req,isUser:true}).list()

            if(err){
                res.status(400)
                return res.json(new BodyResponse({
                    ...err,
                    status:400,
                    error:true,
                    message: err?.message ?? err ?? "Some Error",
                    ...data
                }))
            }
            res.status(200)
            return res.json(new BodyResponse({
                status:200,
                error:false,
                message: "Successfully!",
                ...data
            }))


        }catch(err){
            return res.json(new BodyResponse({
                ...err,
                status:500,
                data: null
            }))
        }
    }

    async _delete(req, res) {
    }

    async _update(req, res) {
    }

    async _read() {
    }

    async create(req, res) {
        try {
            Reflect.set(req.body, 'user', req.user.id)
            const [err, data] = await new _MBooking.Module({fields: req.body, req})._add()
            if (err) throw YuyuidError.badRequest(err)

            const [errRoom, dataRoom] = await new RoomsService({orderBy: "_id", id: data.room}).get()
            if (!errRoom) {
                if (typeof (dataRoom) !== "undefined" && dataRoom !== null && dataRoom !== "") {
                    Reflect.set(data, 'room', dataRoom)
                }
            }
            YuyuidEmitter.dispatch(YuyuidEvent.book.create,
                req.user.email,
                data?._id,
                data?.room
            )


            res.status(!data ? 404 : 200)
            return res.json(new BodyResponse({
                status: !data ? 400 : 200,
                error: false,
                message: "Successfully!",
                data: data
            }))
        } catch (err) {
            res.status(500)
            return res.json(new BodyResponse({
                ...err,
                status: 500,
                error: true,
                message: err?.message ?? "Some Error",
                data: null
            }))
        }
    }

}