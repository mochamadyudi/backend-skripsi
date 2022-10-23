import mongoose from 'mongoose'
const Schema = mongoose.Schema
import { hashUuid } from "@yuyuid/utils";
import moment from "moment";

const ConfirmRooms = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default:null,
    },
    uuid: {
        type:String,
        default: (_)=> {
            return hashUuid()
        }
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"book",
        required:true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"room",
        required:true
    },
    status: {
        type: String,
        default:"waiting"
    },
    is_expired: {
        type: Boolean,
        default: false
    },
    book_date: {
        type: Date,
        required:true
    },
    expiresOn: {
        type:Date,
        default:moment().add(1,'day')
    }
}, {
    timestamps: true,
    versionKey:false,
    autoIndex: true,
});

const ConfirmRoomsSchema = mongoose.model('confirm_room', ConfirmRooms)
ConfirmRoomsSchema.events.on('error', err => console.log({
    error:err.message,
    model:"ConfirmRooms Schema"
}));

export {ConfirmRoomsSchema}
