import moment from "moment";
import mongoose from 'mongoose'

const days = new mongoose.Schema(
    {
        day:{
            type: String,
            default:null
        }
    }
);

const schedule = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            default: null,
        },
        year: {
            type: String,
            default: moment(Date.now(), 'YYYY').format('YYYY')
        },
        month: {
            type: String,
            enum: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        },
        days: [days],
    },{
        timestamps:true,
        versionKey:false
});

const RoomScheduleSchema = new mongoose.Schema({
    rooms: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"rooms",
        default: null,
    },
    schedule: [schedule],
}, {
    timestamps:true,
    versionKey:false
});

const RoomSchedule = mongoose.model("room_schedule", RoomScheduleSchema);
export { RoomSchedule }
