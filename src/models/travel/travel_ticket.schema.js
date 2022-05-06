const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    travel: {
        type: Schema.Types.ObjectId,
        ref: "travels"
    },
    hash_id: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    start_date: {
        type: Date
    },
    expires_date: {
        type: Date
    },
    is_deleted:{
        type: Boolean,
        default:false
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
}, {
    timestamps:true,
    versionKey:false
});
const TravelTicket = mongoose.model("travel_ticket", TicketSchema)
export {TravelTicket}
