import LibService from "../../../services/lib.service";
import {Villa, VillaPhotos} from "@yuyuid/models";
import Pagination from "../../../lib/utils/Pagination";
import {BodyResponse} from "@handler";

export default class VillaScopeService extends LibService{
    constructor(props) {
        super(props);
        this.schema = {
            villa: Villa,
            photos: VillaPhotos
        }
    }


    /**
     *
     * @returns {Promise<*[]>}
     */
    async profile(){
        try{
            if(!this.user) return [ new Error('User undefined'), null]
            if(!this.user?.id) return [ new Error('User.id must be defined!'), null]

            const data = await this.schema.villa.findOne({user:this.user.id}).select([
                "-likes", "-rates", "-videos", "-user"
            ].join(" "))
                .populate("locations.provinces",[
                    "id",
                    "name",
                    "alt_name",
                    "latitude",
                    "longitude",
                ])
                .populate("locations.regencies",[
                    "id",
                    "province_id",
                    "name",
                    "alt_name",
                    "latitude",
                    "longitude",
                ])
                .populate("locations.districts",[
                    "id",
                    "name",
                    "alt_name",
                    "latitude",
                    "longitude",
                ])
                .populate("locations.sub_districts",["name","district_id","id","_id"])
            return [null,data]
        }catch(err){
            return [ err, null ]
        }
    }
    async photos(){
        try{
            if(!this.user) return [ new Error('User undefined'), null]
            if(!this.user?.id) return [ new Error('User.id must be defined!'), null]
            if(!this.user?.villaId) return [ new Error('User.villaId must be defined!'), null]
            if(!this.query) return [ new Error('Query must be defined!'), null]
            const {page, limit, direction} = Pagination(this.query)
            let response = {
                query:{
                    limit,
                    page: page > 0  ? page : 1,
                    direction,
                },
                pagination: {
                    total_record:0,
                    max_page: limit > 0 ? Math.ceil(0 / limit) : 1,
                    current_page:page> 0 ? page : 1,
                },
                data: []
            }
            let condition  = {}
            Reflect.set(condition,'villaId',this.user.villaId)
            const count = await this.schema.photos.find({...condition}).count()
            const data = await this.schema.photos.find({...condition})
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .populate('villaId',[
                    "user",
                    "villa_type",
                    "slug",
                    "name",
                ])
                .then((values)=> {
                    values = values?._doc ?? values
                    Reflect.set(response.pagination,'total_record',count);
                    Reflect.set(response.pagination,'max_page',limit > 0 ? Math.ceil(count / limit) : 1)
                    Reflect.set(response,'data',values)

                    return response
                })
            return [null,data]
        }catch(err){
            return [ err, null ]
        }
    }

    /**
     * @returns {Promise<*[]>}
     * @constructor
     */
    async AddPhotos(){
        try{
            const field = await new this.schema.photos({...this.fields})

            const data = await field.save();

            return [ null, data ];
        }catch(err){
            return [ err, null ];
        }
    }


    async deletePhotos(){
        try{
            if(!this.id) return [ new Error('this.id must be defined'), null];
            const data =  await this.schema.photos.findOne({
                [this.orderBy] : this.id
            }).then((value)=> {
                value = value?._doc ?? value
                return value;
            })
            if(!data){
                return [ new Error('Photos not found'), { message : "NOT FOUND"}]
            }
            const deleted = await this.schema.photos.deleteOne({
                [this.orderBy] : this.id
            })
            return [ null, deleted]
        }catch(err){
            return [ err, null ]
        }
    }
}