const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const VillaLikesSchema = new mongoose.Schema({
    villa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "villa",
        required:true,
    },
    wishlists: [
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

const RoomWishlist = mongoose.model("room_wishlist", VillaLikesSchema);
export { RoomWishlist }
