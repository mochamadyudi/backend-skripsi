import mongoose from 'mongoose'
const Schema = mongoose.Schema
import {encryptChar, HashId, hashUuid} from "@yuyuid/utils";
import { first } from 'lodash'
import moment from "moment";

//Option to not delete posts, this is why we're using this
const Order = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default:null,
    },
    book_number: {
        type: String,
        default: null
    },
    uuid:{
        type:String,
        default: (_)=> {
            return hashUuid()
        }
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"room",
        required:true
    },
    status:{
        type: String,
        enum: ['waiting','unpaid','paid','cancel','expired'],
        default:'waiting',
    },
    amount:{
        type: Number,
        required:true
    },
    limit: {
        type: Number,
        default:1,
    },
    expiresIn: {
        type: Date,
        default: moment().add(23,'hour')
    },
    date: {
        type: Date,
        default:null,
        // required:true

    }
}, {
    timestamps:true,
    versionKey:false,
    autoIndex: true,
});

// const OrderSchema = mongoose.model('order', Order)
// OrderSchema.events.on('error', err => console.log({
//     error:err.message,
//     model:"Booking Schema"
// }));

export {OrderSchema}
