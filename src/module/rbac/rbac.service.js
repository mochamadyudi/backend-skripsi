import LibService from "../../services/lib.service";
import {_MRBAC} from "./index";
import Lpad from "../../lib/utils/lpad";
import {Privilege, Roles} from "../../models/rbac/rbac.schema";
import Pagination from "../../lib/utils/Pagination";

export default class RbacService extends LibService{
    constructor(props) {
        super(props);
        this.schema = {
            role: Roles,
            privilege: Privilege
        }
    }

    async _roleCreate(){
        try{
            const field = new this.schema.role({...this.fields})
            const result = await field.save();
            if(!result) return [ new Error("Failed created"),null];
            return [null, result]
        }catch(err){
            return [ err, null ]
        }
    }

    async _roleList(){
        try{
            const {page, limit, direction} = Pagination(this.query)
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
            let count = await this.schema.role.find({...condition}).count();
            return [ null, await this.schema.role.find({...condition})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .then((value)=> {
                    value = value?._doc ?? value

                    Reflect.set(response.pagination,'total_page',limit > 0 ? Math.ceil(count / limit) : 1)
                    Reflect.set(response,'data',value)

                    return response
                })]
        }catch(err){
            return [ err, null ]
        }
    }
    async _roleDetail(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }
    async _roleSoftDelete(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }
    async _roleDestroy(){
        try{
            return [null, await this.schema.role.deleteOne({
                [this.orderBy ?? "_id"]: this.id
            })]
        }catch(err){
            return [ err, null ]
        }
    }

    async _privilegeCreate(){
        try{
            const field = new this.schema.privilege({...this.fields})
            const result = await field.save();
            if(!result) return [ new Error("Failed created"),null];
            return [null, result]
        }catch(err){
            return [ err, null ]
        }
    }

    async _privilegeList(){
        try{
            const {page, limit, direction} = Pagination(this.query)
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
            let count = await this.schema.privilege.find({...condition}).count();
            return [ null, await this.schema.privilege.find({...condition})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .then((value)=> {
                    value = value?._doc ?? value

                    Reflect.set(response.pagination,'total_page',limit > 0 ? Math.ceil(count / limit) : 1)
                    Reflect.set(response,'data',value)

                    return response
                })]
        }catch(err){
            return [ err, null ]
        }
    }
    async _privilegeDetail(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }
    async _privilegeSoftDelete(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }
    async _privilegeDestroy(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }

}