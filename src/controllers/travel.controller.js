import {UserService} from "@yuyuid/services";
import {BodyResponse} from "@handler";
import Pagination from "../lib/utils/Pagination";
import {Travel} from "@yuyuid/models";
import {ObjResolve} from "@yuyuid/utils";

export default class TravelController {

    async Likes (req,res,next){
        try {
            const token = await UserService.GetToken(req)
            const data = await UserService.UserLoaded(req.user.id)
            return res.json({
                message: "User has been found",
                success: true,

                data: {
                    token,
                    ...data,
                }
            }).status(200);
            // return res.json({message: "Create Successfully", data:req.body}).status(200)
        } catch (e) {
            return next(e)
        }
    }


    async _nearMe(req,res){
        try{
            const {page, limit, direction} = Pagination(req.query)

            const condition = {}

            if(ObjResolve(req.query,'near')){
                let $near = {
                    $geometry:{},
                    $maxDistance: 5000
                }
                let coordinates = []
                if(ObjResolve(ObjResolve(req.query,'near'),'long')){
                    let long = Number(ObjResolve(ObjResolve(req.query,'near'),'long'))
                    if(!isNaN(long) && typeof(long) === "number"){
                        coordinates.push(long)
                    }

                }
                if(ObjResolve(ObjResolve(req.query,'near'),'lat')){
                    let lat = Number(ObjResolve(ObjResolve(req.query,'near'),'lat'))
                    if(!isNaN(lat) && typeof(lat) === "number"){
                        coordinates.push(lat)
                    }

                }
                Reflect.set($near.$geometry,'coordinates',coordinates)
                if(ObjResolve(ObjResolve(req.query,'near'),'type')){
                    Reflect.set($near.$geometry,'type',ObjResolve(ObjResolve(req.query,'near'),'type') ?? "Point")
                }
                if(ObjResolve(ObjResolve(req.query,'near'),'distance')){
                    Reflect.set($near,'$maxDistance',ObjResolve(ObjResolve(req.query,'near'),'distance') )
                }


                Reflect.set(condition,'locations', {$near: $near})
            }

            return await Travel.find(condition)
                .populate("categories")
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .then((val)=> {
                    return res.json(new BodyResponse({
                        error:false,
                        message: "Successfully!",
                        data: val
                    }))
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        ...err,
                        error:true,
                        message: err?.message ?? "Some Error",
                        data: null
                    }))
                })


        }catch(err){
            return res.json(new BodyResponse({
                ...err,
                error:true,
                message: err?.message ?? null,
                data: null
            }))
        }
    }
}
