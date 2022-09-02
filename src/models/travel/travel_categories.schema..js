import {hashUuid} from "@yuyuid/utils";

const mongoose = require("mongoose");


//Create reference to user model, associated with _id in database
const TravelCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
    },
    slug: {
        type: String,
        required: true,
        unique:true,
    },
    hash_id:{
        type: String,
        required: true,
        unique:true,
        default:hashUuid(),
    },
    is_published: {
        type:Number,
        enum: [-1,0,1],
        default:0
    },
    is_verify:{
        type: Number,
        enum: [0,1],
        default: 0,
    },
    about:{
        title:{
            type: String,
            default:null,
        },
        content: {
            type: String,
            default: null
        }
    },
    background:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps:true,
    versionKey:false
});

const TravelCategory = mongoose.model("travel_category", TravelCategoriesSchema);
export { TravelCategory }
