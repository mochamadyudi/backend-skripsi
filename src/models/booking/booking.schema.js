import mongoose from 'mongoose'
import strpad from 'strpad'
const Schema = mongoose.Schema
import {encryptChar, HashId, hashUuid} from "@yuyuid/utils";
import { first } from 'lodash'

//Option to not delete posts, this is why we're using this
const Booking = new Schema({
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

const BookingSchema = mongoose.model('book', Booking)
BookingSchema.events.on('error', err => console.log({
    error:err.message,
    model:"Booking Schema"
}));

export {BookingSchema}
