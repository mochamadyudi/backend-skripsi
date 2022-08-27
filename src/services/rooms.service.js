import {Room} from "@yuyuid/models";
import {ObjResolve} from "@yuyuid/utils";
import Pagination from "../lib/utils/Pagination";

export default class RoomsService{
    constructor(props = {}) {
        this.props = {
            ...props
        }
        this.body = props?.body ?? {}
        this.query = props?.query ?? {}

    }

    async _list(id = null){
        try{
            if(id) {
                const [err, data] = await this.#single(id)
                if(err) return [ err, null ]
                return [ null , data ]
            }else{

                const [err, data] = await this.#lists(this.query)
                if(err) return [ err, null ]
                return [ null , data ]
            }

        }catch(err){
            return [ err, null ]
        }
    }


    /**
     *
     * @param id
     * @returns {Promise<*[]>}
     */
    async #single(id){
        try{
            let query = this.query
            let condition = {}

            if(ObjResolve(query,'orderBy')){
                Reflect.set(condition, ObjResolve(query,'orderBy'), id)
            }
            return await Room.findOne(condition)
                .then((result)=> {
                    return [ null, result ]
                })
                .catch((err)=> {
                    return [ err, null ]
                })
        }catch(err){
            return [ err, null ]
        }
    }

    /**
     *
     * @returns {Promise<*[]|*>}
     */
    async #lists(query){
        try{
            console.log(query)
            const {page, limit, direction} = Pagination(query)
            let condition = {}
            return await Room.find({...condition})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                .exec((err, result) => {
                    console.log({err,result},'PRIVATE')
                    if(err) return [err, null]
                    return [ null ,result  ]
                })
        }catch(err){
            console.log(err)
            return [err , null ]
        }
    }
}
