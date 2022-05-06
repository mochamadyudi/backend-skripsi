const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const TravelRatingSchema = new mongoose.Schema({
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "travel"
    },
    rates: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            rate: {
                type: Number,
                default: 0
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

const TravelRating = mongoose.model("travel_rating", TravelRatingSchema);
export { TravelRating }
