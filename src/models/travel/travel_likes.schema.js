const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const TravelLikeSchema = new mongoose.Schema({
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "travel"
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }
    ],


    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps:true,
    versionKey:false
});

const TravelLikes = mongoose.model("travel_like", TravelLikeSchema);
export { TravelLikes }
