import {isAdmins} from "../../../middlewares/auth";
import {Router} from "express";
import {TravelCategory} from "../../../../models/travel/travel_categories.schema.";
import {encryptChar} from "@yuyuid/utils";
import {Villa} from "../../../../models/villa/villa.schema";
import Pagination from "../../../../lib/utils/Pagination";

const route = Router()
export default (app) => {
    app.use('/travel', route)

    app.use(isAdmins)

    /**
     * CATEGORY LIST
     */
    route.get('/category/list', async (req, res) => {
        try {

            const {page, limit, direction} = Pagination(req.query)

            let is_verify = 0
            let is_published = 0

            if (typeof (req.query?.is_verify) !== "undefined") {
                is_verify = req.query?.is_verify
            }
            if (typeof (req.query?.is_published) !== "undefined") {
                is_published = req.query?.is_published
            }


            const user = await TravelCategory.find()
                .or([{is_verify}, {is_published}])
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })


            const count = await TravelCategory.find()
                .or([{is_verify}, {is_published}])
                .count()


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
                data: user
            })

        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })

    /**
     * CATEGORY CREATE
     */
    route.post('/category/create', async (req, res) => {
        try {
            const {name} = req.body
            const newslug = name.toString().toLowerCase().replace(/ /g, '-')
            const hashing = await encryptChar(name, 5)
            const tax_cat = new TravelCategory({
                name,
                slug: newslug,
                hash_id: hashing
            })

            await tax_cat.save(function (error, doc, next) {
                console.log({error})
                if (error && typeof (error?.code) !== "undefined" && error.code === 11000) {
                    return res.json({
                        error: true,
                        message: "name must be unique",
                        data: null
                    })
                } else {
                    return res.json({
                        error: false,
                        message: "Successfully! category has been created!",
                        data: doc
                    })
                }
            })

        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })

    route.delete('/category/delete/:id', async (req, res) => {
        try {
            const {id} = req.params

            await TravelCategory.findOneAndRemove({_id: id})
                .then((field) => {
                    if (typeof (field) !== "undefined" && field !== null) {

                        return res.json({
                            error: false,
                            message: `category ${field?.name} is deleted`,
                            data: field
                        })

                    } else {
                        return res.json({
                            error: true,
                            message: `Category ID ${id} not found!`,
                            data: null
                        })
                    }

                })
                .catch((err) => {
                    return res.json({
                        error: true,
                        message: err.message,
                        data: null
                    })
                })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })

    /**
     * GET SINGLE BY SLUG NAME
     */
    route.get('/category/slug/:slug_name', async (req, res) => {
        try {
            const {slug_name} = req.params
            const cat = await TravelCategory.findOne({
                slug:slug_name
            })
            if (cat) {
                return res.json({
                    error: false,
                    message: "Successfully!",
                    data: cat
                }).status(200)
            } else {
                return res.json({
                    error: false,
                    message: `Category ${slug_name} not found!`,
                    data: null
                }).status(200)
            }

        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            }).status(500)
        }
    })

    route.put('/category/verify/:id', async (req,res)=> {
        try{
            let {id} = req.params
            await TravelCategory.findOneAndUpdate(
                {_id: id},
                {$set: {
                    is_verify:1
                    }},
                {new: true}
            )
                .then((field)=> {
                    if (field){
                        return res.json({
                            error:false,
                            message: "Successfully!",
                            data: field
                        })
                    }else{
                        return res.json({
                            error:true,
                            message: `Category ${id} not found!`,
                            data: null
                        })
                    }
                })
                .catch((err)=> {
                    return res.json({
                        error:true,
                        message: err.message,
                        data: null
                    })
                })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    })

    route.put('/category/update/:id', async (req,res)=> {
        try{
            let {id} = req.params
            let body = req.body
            let fields = {}
            let about = fields.about
            if (typeof(body?.title) !== "undefined") about.title = body.title
            if (typeof(body?.content) !== "undefined") about.content = body.content
            if(typeof(body.name) !== "undefined") {
                fields.name = body.name
                fields.slug = body.name.toString().toLowerCase().replace(/ /g, '-')
            }
            await TravelCategory
                .findOneAndUpdate(
                    {_id:id},
                    {$set: fields},
                    {new: true})
                .then((field)=> {
                    if(field){
                        return res.json({
                            error:false,
                            message: `Successfully! Category ${field?.name} is Updated!`
                        })
                    }else{
                        return res.json({
                            error:true,
                            message: `Error! Category ID ${id} not found!`,
                            data: null
                        })
                    }
                })
                .catch((err)=> {
                    return res.json({
                        error:true,
                        message: err.message,
                        data: null
                    })
                })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    })
}
