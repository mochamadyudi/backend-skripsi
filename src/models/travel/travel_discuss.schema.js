const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const TravelDiscussSchema = new mongoose.Schema({
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "travel"
    },
    discuss: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            comment: {
                type: String,
                default: null
            }
        }
    ],


    date: {
        type: Date,
        default: Date.now
    }
});

const TravelDiscuss = mongoose.model("travel_discuss", TravelDiscussSchema);
export { TravelDiscuss }
