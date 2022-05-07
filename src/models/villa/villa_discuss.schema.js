const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const VillaDiscussSchema = new mongoose.Schema({
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
}, {
    timestamps:true,
    versionKey:false
});

const VillaDiscuss = mongoose.model("villa_discuss", VillaDiscussSchema);
export { VillaDiscuss }
