import mongoose from 'mongoose'
import {first} from "lodash";
import {ObjResolve} from "@yuyuid/utils";
export const ToObjId = (id)=> {
    return mongoose.Types.ObjectId(id)
}
export const ClearCountAggregate =(result,key = 'key')=> {
    if(ObjResolve(first(result),key)){
        return first(result)[key] ?? 0
    }
    return 0

}