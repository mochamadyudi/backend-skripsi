import moment from "moment";
import mongoose from 'mongoose'

const RoomScheduleSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"rooms",
        default: null,
    },
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'books'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    entryDate: {
        type: mongoose.Schema.Types.Date,
    },
    isActive: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    expiresOn: {
        type: mongoose.Schema.Types.Date,
        default:moment().add(2,'day')
    },
    status:{
        type: mongoose.Schema.Types.String,
        default: 'waiting'
    },
    outDate:{
        type: mongoose.Schema.Types.Date,
        default:null
    },
    periods: [],
    payRemember:[]

}, {
    timestamps:true,
    versionKey:false
});

const RoomSchedule = mongoose.model("room_schedule", RoomScheduleSchema);
export { RoomSchedule }
