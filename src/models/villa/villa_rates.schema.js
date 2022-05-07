const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const VillaRatesSchema = new mongoose.Schema({
    rates: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            rate: {
                type: Number,
                default:0
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

const VillaRates = mongoose.model("villa_rates", VillaRatesSchema);
export { VillaRates }
