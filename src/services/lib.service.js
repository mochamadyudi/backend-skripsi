import {User} from "@yuyuid/models";

export default class LibService {
    constructor(props = {}) {
        this.props = props
        this.req = props?.req ?? undefined
        this.res = props?.res ?? undefined
        this.query = props?.query ?? {}
        this.fields = props?.fields ?? {}
        this.id = props?.id ?? null
        this.orderBy = props?.orderBy ?? "_id"
        this.schema = props?.schema ?? undefined
    }

    async create(){
        try{
            if(typeof(this.schema) !== undefined && typeof(this.schema) === "function"){
                return await this.schema.create(this.fields)
                    .then(({_doc})=> {
                        if(!_doc) return [ new Error("Some Error"), null]
                        return [ null , _doc ]
                    })
                    .catch((err)=> {
                        return [ err, null ]
                    })
            }
        }catch(err){
            return [ err , null ]
        }
    }
}