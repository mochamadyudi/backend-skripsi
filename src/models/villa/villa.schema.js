import {makeIdRandom} from "@yuyuid/utils";

const mongoose = require("mongoose");
const photos = new mongoose.Schema({
    images:{
        type: String,
        default :null
    },
});
const videos = new mongoose.Schema({
    url:{
        type: String,
        default :null
    },
});

const VillaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    villa_type: {
        type: Number,
        default:1,
    },
    slug:{
        type: String,
        unique: true,
        default: makeIdRandom(5),
    },
    name: {
        type: String,
        default: null,
    },
    website: {
        type: String,
        default: null,
    },
    thumbnail: {
        type: String,
        default: null
    },
    photos: [photos],
    videos: [videos],
    social: {
        twitter: {
            type: String,
            default :null
        },
        youtube: {
            type: String,
            default :null
        },
        facebook: {
            type: String,
            default :null
        },
        instagram: {
            type: String,
            default :null
        }
    },
    bio: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default : false,
    },
    updated_at: {
        type: Date,
        default: null,
    },
    location: {
        lat: {
            type: String,
            default :null
        },
        long:{
            type: String,
            default :null
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
},{ versionKey: false });

const Villa = mongoose.model("villa", VillaSchema);

export { Villa }
