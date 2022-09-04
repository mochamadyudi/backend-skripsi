const mongoose = require("mongoose");

//Create reference to user model, associated with _id in database
const TravelDiscussSchema = new mongoose.Schema({
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "travel",
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    comment: {
        type: String,
        default: null
    },
    parentDiscussId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"travel_discuss",
        required:false,
        default:null,
    },
    likes:[],
    dislikes:[],
    is_updated:{
        type: Boolean,
        default:false,
    },
    is_hidden: {
        type: Boolean,
        default:false,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps:true,
    versionKey:false
});

const TravelDiscuss = mongoose.model("travel_discuss", TravelDiscussSchema);
export { TravelDiscuss }
