import {makeIdRandom} from "@yuyuid/utils";
import moment from 'moment'

const mongoose = require("mongoose");

const VillaSchema = new mongoose.Schema({
    villa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "villa",
        required:true,
    },
    type: {
        type: String,
        enum: ['bronze',"silver","gold","platinum"],
        default:"bronze"
    },
    is_deleted: {
        type: Boolean,
        default : false,
    },

    end_date: {
        type: Date,
        default: null
    },
    start_date: {
        type: Date,
        default:null
    },
    updated_at: {
        type: Date,
        default: null,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
},{ versionKey: false });

const VillaPromotion = mongoose.model("villa_promotion", VillaSchema);

export { VillaPromotion }
