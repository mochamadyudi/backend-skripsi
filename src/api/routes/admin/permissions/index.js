import { Router } from 'express'
import {BodyResponse} from "@handler";
import {PermissionsValidator} from "../../../../lib/validator";
import {UpRole, UpRolePermissions} from "@yuyuid/models";
import Pagination from "../../../../lib/utils/Pagination";
import {ObjResolve} from "@yuyuid/utils";
const route = Router()
export default (app)=> {
    app.use('/permissions',route)
    route.post("/role",PermissionsValidator.RolesValidator, async (req,res)=> {
        try{
            let { body } = req

            const exists = await UpRole.findOne({
                role:body.role
            })

            if(exists) return res.json({error:true,message: "Duplicated!",data:null})
            return await UpRole.create({
                role:body?.role,
                slug:body?.slug,
            }).then(({_doc})=> {
                return res.json({
                    error:false,
                    message: "Successfully!",
                    data:_doc
                })
            })
                .catch((err)=> {
                    return res.json({
                        error:true,
                        message: err.message,
                        data:null
                    })
                })

        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err.message,
                data: null
            }))
        }
    })
    route.get('/role', async(req,res)=> {
        let { query } = req
        const {page ,limit,direction} = Pagination(query)
        let response = {
            query:{
                limit,
                page: page > 0  ? page : 1,
                direction,
            },
            pagination: {
                total_page: limit > 0 ? Math.ceil(0 / limit) : 1,
                current_page:page> 0 ? page : 1,
            },
            data: []
        }
        let condition = {

        }
        try{


            console.log(ObjResolve(query,'q'))
            if(ObjResolve(query,'q')){
                Reflect.set(condition,ObjResolve(query,'order') ?? "slug", {
                    $regex: ['.*',ObjResolve(query,'q'),'.*'].join("")
                })
                Reflect.set(condition,'$options', 'i')
            }

            let count = await UpRole.count(condition)
            return await UpRole.find(condition)
                .limit(limit)
                .skip(limit * (page > 1 ? page: 0))
                .then((val)=> {
                    Reflect.set(response.pagination,'total_page',limit > 0 ? Math.ceil(count / limit) : 1)
                    Reflect.set(response,'data',val)

                    return res.json(new BodyResponse({
                        error:false,
                        message: "Successfully!",
                        ...response,
                    }))
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        status:500,
                        error:true,
                        message: err.message,
                        data: null
                    }))
                })

        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err.message,
                data: null
            }))
        }
    })
    route.get('/role-permissions', async(req,res)=> {
        let { query } = req
        const {page ,limit,direction} = Pagination(query)
        let response = {
            query:{
                limit,
                page: page > 0  ? page : 1,
                direction,
            },
            pagination: {
                total_page: limit > 0 ? Math.ceil(0 / limit) : 1,
                current_page:page> 0 ? page : 1,
            },
            data: []
        }


        try{
            let count = await UpRolePermissions.count()
            return await UpRolePermissions.find({})
                .limit(limit)
                .skip(limit * (page > 1 ? page: 0))
                .then((val)=> {
                    Reflect.set(response.pagination,'total_page',limit > 0 ? Math.ceil(count / limit) : 1)
                    Reflect.set(response,'data',val)

                    return res.json(new BodyResponse({
                        error:false,
                        message: "Successfully!",
                        ...response,
                    }))
                })
                .catch((err)=> {
                    return res.json(new BodyResponse({
                        status:500,
                        error:true,
                        message: err.message,
                        data: null
                    }))
                })

        }catch(err){
            return res.json(new BodyResponse({
                status:500,
                error:true,
                message: err.message,
                data: null
            }))
        }
    })
}
