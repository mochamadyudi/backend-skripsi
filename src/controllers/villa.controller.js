import BodyResponse from "../lib/handler/body-response";
import {Villa} from "@yuyuid/models";
import Pagination from "../lib/utils/Pagination";

export default class VillaController{

    /**
     *
     * @param id
     * @param options
     * @returns {Promise<BodyResponse>}
     * @private
     */
    async _get(id = null, options = {query:{},params:{}}){
       try{
           if (id === null){
               const { page, direction, limit} =  Pagination(options.query)
               const count = await Villa.find().count()
               return await Villa.find({})
                   .limit(limit)
                   .skip(limit * (page > 1 ? page - 1 : 0))
                   .sort({
                       date: direction === "desc" ? -1 : 1
                   })
                   .then((fields)=> {
                       if(fields){
                           return new BodyResponse({
                               error: false,
                               message: "successfully!",
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
                               data: fields
                           })
                       }else{
                           return new BodyResponse({
                               error: false,
                               message: "Data Not found!",
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
                           })
                       }
                   })

                   .catch((err)=> {

                   })

           }else{
               return await Villa.findById({_id:id})
                   .then((field)=> {
                       if(field){
                           return new BodyResponse({
                               error:false,
                               message: "Successfully!",
                               data: field
                           })
                       }else{
                           return new BodyResponse({
                               error:false,
                               message: `Villa ${id} not found!`,
                               data: null
                           })
                       }
                   })
           }
       } catch(err){
           return new BodyResponse({error:true,message:err.message})
       }
    }
}
