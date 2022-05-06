import {Villa} from "@yuyuid/models";
import YuyuidError from "@yuyuid/exception";
import {makeIdRandom} from "@yuyuid/utils";
import VillaController from "../controllers/villa.controller";
import {BodyResponse} from '@yuyuid/handler'


export default class VillaService {

    /**
     * CREATE VILLA
     * @param payload
     * @returns {Promise<any|{data: null, error: boolean, message}>}
     */
    static async createVilla(payload){
        try{
            const villa = new Villa({
                ...payload,
                user: payload.user,
                slug:makeIdRandom(10),
                facility:{
                    ac:false,
                    tv:false,
                    hall: false,
                    gazebo: false,
                    wifi:false,
                    swimming_pool:false,
                    parking:false,
                    meeting_room:false,
                }
            });
            await villa.save()
            return villa;
        }catch(err){
            return {
                error: true,
                message: err.message,
                data: null,
            }
        }
    }

    static async updateVilla(id, payload = {}){
        try{

        }catch(err){
            return {
                error:true,
                message:err.message,
                data:null,
            }
        }
    }
    /**
     *
     * @returns {Promise<BodyResponse>}
     * @param req
     * @param res
     */
    static async getVilla(req,res){
       try{
           await new VillaController()._get(null,{query:req.query,params:req.params})
               .then(({data,error,message,status,pagination,query})=> {
                   return res.json({
                       error,message,status,
                       pagination,query,
                       data
                   })
               }).catch(({data,error,message,status,pagination,query})=> {
                   return res.json({
                       error,message,status,
                       pagination : pagination ?? null,
                       query: query ?? null,
                       data
                   })
               })

       } catch(err){
           return new BodyResponse({error:true,message: err.message})
       }
    }

    /**
     * GET DETAIL VILLA
     * @param req
     * @param res
     * @returns {Promise<BodyResponse>}
     */
    static async getDetail(req,res){
       try{
           const {id} =  req.params
           return res.json({
               ...await new VillaController()._get(id,{query:req.query})
           })
       }catch(err){
           return new BodyResponse({error:true,message: err.message})
       }
    }

    static async getVillaTop10(){

    }

    static async getVillaPromotion(req,res){
        try{

        }catch(err){

        }
    }


}
