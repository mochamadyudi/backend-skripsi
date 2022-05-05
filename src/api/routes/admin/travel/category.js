import {Router} from "express";
import Pagination from "../../../../lib/utils/Pagination";
import {TravelCategory} from "../../../../models/travel/travel_categories.schema.";
import {encryptChar} from "@yuyuid/utils";

const route = Router()
export default (app)=> {
    app.use('/category', route)

    /**
     * CATEGORY LIST
     */
    route.get('/list', async (req, res) => {
        try {

            const {page, limit, direction} = Pagination(req.query)

            let is_verify = 0
            let is_published = 0

            if (typeof (req.query?.is_verify) !== "undefined" && typeof(req.query?.is_published) !== "undefined") {
                let is_verify = req.query?.is_verify
                let is_published = req.query?.is_published
                return await getData(true, [{is_verify},{is_published}])
            }else if (typeof (req.query?.is_published) !== "undefined" && typeof (req.query?.is_verify) === "undefined" ) {
                let is_published = req.query?.is_published
                return await getData(true, [{is_published}])
            }else if (typeof (req.query?.is_published) === "undefined" && typeof (req.query?.is_verify) !== "undefined"){
                let is_verify = req.query?.is_verify
                return await getData(true, [{is_verify}])
            }else{
                return await getData(false)
            }



            async function getData(query = false, options =[]){
                if (query){
                    const user = await TravelCategory.find()
                        .and(options)
                        .limit(limit)
                        .skip(limit * (page > 1 ? page - 1 : 0))
                        .sort({
                            date: direction === "desc" ? -1 : 1
                        })


                    const count = await TravelCategory.find()
                        .and(options)
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

                }
                else{
                    const user = await TravelCategory.find()
                        .limit(limit)
                        .skip(limit * (page > 1 ? page - 1 : 0))
                        .sort({
                            date: direction === "desc" ? -1 : 1
                        })


                    const count = await TravelCategory.find()
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
                }
            }

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
    route.post('/create', async (req, res) => {
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

    route.delete('/delete/:id', async (req, res) => {
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
    route.get('/slug/:slug_name', async (req, res) => {
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

    route.put('/verify/:id', async (req,res)=> {
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

    route.put('/update/:id', async (req,res)=> {
        try{
            let {id} = req.params
            let body = req.body
            let fields = {}
            fields.about = {}
            if (typeof(body?.title) !== "undefined") fields.about.title = body.title
            if (typeof(body?.content) !== "undefined") fields.about.content = body.content
            if(typeof(body.name) !== "undefined") {
                fields.name = body.name
                fields.slug = body.name.toString().toLowerCase().replace(/ /g, '-')
            }
            fields.is_published = 1
            await TravelCategory
                .findOneAndUpdate(
                    {_id:id},
                    {$set: fields},
                    {new: true})
                .then((field)=> {
                    if(field){
                        return res.json({
                            error:false,
                            message: `Successfully! Category ${field?.name} is Updated!`,
                            data: field
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
