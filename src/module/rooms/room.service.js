import LibService from "../../services/lib.service";
import {_MRoom, _MUser} from "./index";
import Lpad from "../../lib/utils/lpad";
import {Room, User, Villa} from "@yuyuid/models";
import Pagination from "../../lib/utils/Pagination";
import {ObjResolve} from "@yuyuid/utils";

export default class RoomService extends LibService{
    constructor(props) {
        super(props);
        this.schema = _MRoom.Provider
    }

    async create(){
        try{
            let a = new Lpad({schema:this.schema})
            console.log(a)
            return [ null, {test:1}]
        }catch(err){
            return [ err, null ]
        }
    }

    async list(){
        try{
            const {page, limit, direction} = Pagination(this.query);
            let response = {
                query:{
                    limit,
                    page: page > 0  ? page : 1,
                    direction,
                },
                pagination: {
                    total_record: 0,
                    max_page: limit > 0 ? Math.ceil(0 / limit) : 1,
                    current_page:page> 0 ? page : 1,
                },
                data: []
            }

            let condition = {}

            if(ObjResolve(this.query,'villaId')){
                Reflect.set(condition,'villa',this.query.villaId);
            }
            let count = await this.schema.count({...condition})
            return [null,
                await this.schema.find({...condition}).select("-password -salt -__v")
                .limit(limit)
                .skip(limit * (page > 1 ? page - 1 : 0))
                .sort({
                    date: direction === "desc" ? -1 : 1
                })
                    .then((val)=> {
                        Reflect.set(response.pagination,'total_record',count)
                        Reflect.set(response.pagination,'max_page',limit > 0 ? Math.ceil(count / limit) : 1)
                        Reflect.set(response,'data',val)
                        return response;
                    })
                    .catch((err)=> {
                        return response;
                    })
            ];
        }catch(err){
            return [ err, null]
        }
    }


    async detail(){
        try{
            let condition =  {}
            if(!this.id) return [new Error("Id must be defined!"),null];
            if(this.id) Reflect.set(condition,this.orderBy ?? "_id",this.id)


            const result = await this.schema.findOne(condition)
                .select("-password -salt -__v")
                .then(async (value)=> {
                    value = value?._doc ?? value;
                    if(ObjResolve(value,'role')){
                        switch (value.role){
                            case "villa":
                                const villa = await Villa.findOne({user:value?._id}).select("-user -photos -rates -likes -videos")

                                if(villa){
                                    const room = await Room.find({villa:villa?._id})
                                    Reflect.set(value,'room',room)
                                }else{
                                    Reflect.set(value,'room',[]);
                                }
                                Reflect.set(value,'villa',villa);
                                break;
                            case "admin":
                            case "customer":
                            default:
                                Reflect.set(value,'profiles',null);
                                break;
                        }
                    }
                    console.log({value});
                    return value;
                })
            return [ null , result]
        }catch(err){
            return [ err, null ]
        }
    }

    async delete(){
        try {
            const deleted = await this.schema.findOneAndRemove({id:this.id})
            return [ null , deleted ]
        }catch (err){
            return [ err, null ]
        }
    }

}