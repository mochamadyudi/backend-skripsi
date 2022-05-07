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
    rates:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"villa_rates"
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"villa_like"
    },
    discuss:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"villa_discuss"
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
        url:{
            type:String,
            default:null
        },
        prefix:{
            type:String,
            default:null
        }
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
    contact:{
        phone_number: {
            type: Number,
            default:null,
        },
        email: {
            type:String,
            default: null,
        },
        whatsapp:{
            type:String,
            default:null
        }
    },
    description: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default : false,
    },
    is_update:{
        type: Boolean,
        default:false,
    },
    is_published:{
        type: Number,
        default:0
    },
    seen:{
        type: Number,
        default:0
    },
    location: {
        country: {
            type: String,
            default: "indonesia",
        },
        province: {
            type: String,
            default: "jawa barat",
        },
        city: {
            type: String,
            default: "Kab. karawang"
        },
        district: {
            type: String,
            default: null
        },
        sub_district: {
            type: String,
            default: null
        },
        zip_code: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null,
        },
        endpoint: {
            lat: {
                type: String,
                default: null
            },
            long: {
                type: String,
                default: null
            }
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true,
    versionKey: false
});

const Villa = mongoose.model("villa", VillaSchema);

export { Villa }
