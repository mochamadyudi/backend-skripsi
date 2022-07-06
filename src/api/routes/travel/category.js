import {Router} from 'express'
import {TravelCategory} from "../../../models/travel/travel_categories.schema.";
import Pagination from "../../../lib/utils/Pagination";
const route = Router()
export default function(){
    const app = Router()
    app.use('/', route)

    route.get('/list', async(req,res)=> {
        try{

            const {page, limit, direction} = Pagination(req.query)

            let travelCategory = TravelCategory.find()
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })

            travelCategory.exec((err,category)=> {
                if(!err){
                    return res.json({
                        error: false,
                        message: null,
                        query: {
                            limit,
                            page: page > 0 ? page : 1,
                            direction,
                        },
                        pagination: {
                            total_page: limit > 0 ? Math.ceil(category.length / limit) : 1,
                            current_page: page > 0 ? page : 1,
                            total_record: category.length,
                        },
                        data: category
                    })
                }else{
                    return res.json({
                        error:true,
                        message: err.message,
                        data: null
                    })
                }
            })
        }catch(err){

        }
    })
    return app
}
