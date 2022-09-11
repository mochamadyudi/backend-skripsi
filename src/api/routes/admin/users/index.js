import {Router} from "express";
import {Profile, User} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {isAdmins} from "../../../middlewares/auth";
import {Villa} from "../../../../models/villa/villa.schema";
import {ObjResolve} from "@yuyuid/utils";
import {ObjectId} from "mongodb";


const route = Router()

export default (app) => {
    app.use('/user', route)

    app.use(isAdmins)

    route.delete("/delete/:id", async (req, res) => {
        try {

            const {id} = req.params
            await User.findOneAndRemove({_id: id})
                .then((response) => {
                    if (typeof (response?.email) !== "undefined" && response?.email !== null) {
                        return res.json({
                            error: false,
                            message: `Successfully! deleted Account ID ${response?.email}`,
                        }).status(200)
                    } else {
                        return res.json({
                            error: true,
                            message: `User Not found!`,
                        }).status(200)
                    }

                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: err.message
                    }).status(200)
                })


            // return res.json({
            //     error:;
            // })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    route.get('/list', async (req, res) => {
        try {
            const {page, limit, direction} = Pagination(req.query)
            const user = await User.find({_id: {$ne: req.user.id}}).select("-password -salt -__v")
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })

            // const villa = await Villa.find({_id: {$ne : req.user.id}}).populate("user", ["firstName", "lastName", "username", "email", "role","is_verify"])
            //     .limit(limit)
            //     .skip(limit * (page > 1 ? page - 1: 0))
            //     .sort({
            //         date: direction === "desc"?-1:1
            //     })
            let data = [
                ...user,
                // ...villa
            ]


            const count = await User.find().count()


            return res.json({
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
                data: data
            })
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
            // return res.json({
            //     error:;
            // })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })
    route.get('/detail/:id', async (req, res) => {
        try {
            const {id} = req.params

            const user = await User.findOne({_id: id})
            if (user) {

                if (typeof (user.role) !== "undefined") {
                    switch (user.role) {
                        case "villa":
                            const villas = await Villa.findOne({user: user.id}).populate("user", ["firstName", "lastName", "username", "email", "role", "is_verify", "avatar"])
                            return res.json({
                                error: false,
                                message: null,
                                data: villas
                            }).status(200)
                        default:
                            const profiles = await Profile.findOne({user: user.id}).populate("user", ["firstName", "lastName", "username", "email", "role", "is_verify", "avatar"])
                            return res.json({
                                error: false,
                                message: null,
                                data: profiles
                            }).status(200)
                    }
                }
            }

        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.get('/search/:q', async (req, res) => {
        try {
            let {query, params} = req
            const {page, limit, direction} = Pagination(query)
            const {q} = params
            let match = {}
            let options = {}

            Reflect.set(match, "$or", [
                {
                    firstName: {
                        $regex: q,
                        $options: "-i"
                    }
                },
                {
                    lastName: {
                        $regex: q,
                        $options: "-i"
                    }
                }
            ])


            // Reflect.set(options,"$lookup",{
            //     from:"users_profiles",
            //     localField:"user",
            //     foreignField:"_id",
            //     as:"userProfile"
            // })

            const users = await User.aggregate([
                {
                    $match: {
                        ...match,
                    }
                },
                {
                    $lookup: {
                        from: "users_profiles",
                        localField: "_id",
                        foreignField: "user",
                        as: "profiles",
                    }
                },
                {
                    "$unwind": "$profiles"
                },
            ])
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })

            // const users  = await User.find({
            //     ...options,
            //     $lookup:{
            //         from:"users_profiles",
            //         localField:"user",
            //         foreignField:"_id",
            //         as:"profiles"
            //     }
            // },undefined,{rawResult:true})
            //     .limit(limit)
            //     .skip(limit * (page > 1 ? page - 1 : 0))
            //     .sort({
            //         date: direction === "desc" ? -1 : 1
            //     })

            const count = await User.find({...options}).count()

            return res.json({
                error: false,
                message: "successFully!",
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
                options,
                data: users
            })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })
}
