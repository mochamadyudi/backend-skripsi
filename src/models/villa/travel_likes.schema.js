const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const VillaLikesSchema = new mongoose.Schema({
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

const VillaLikes = mongoose.model("villa_like", VillaLikesSchema);
export { VillaLikes }
