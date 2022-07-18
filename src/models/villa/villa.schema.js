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
        // url:{
        //     type:String,
        //     default:null
        // },
        // prefix_url:{
        //     type:String,
        //     default:null
        // },
        path:{
            type: String,
            default :null
        },
        filename: {
            type: String,
            default :null
        },
        destination:{
            type: String,
            default :null
        },
        resize_active:{
            type: Array,
            default :[]
        },
        prefix_url:{
            type: String,
            default :null
        },
        originalname:{
            type: String,
            default :null
        },
        format:{
            type: String,
            default :null
        },
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
        type: Boolean,
        default:false
    },
    seen:{
        type: Number,
        default:0
    },
    locations:{
        provinces:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_provinces"
        },
        regencies:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_regencies"
        },
        districts:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_districts"
        },
        sub_districts:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_vilages"
        },
        address:{
            type: String,
            default: null
        },
        lat:{
            type: Number,
            default:null
        },
        lng:{
            type: Number,
            default:null
        },
        zip_code:{
            type:Number,
            default:null
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true,
    versionKey: false,
    toJSON: {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});



const Villa = mongoose.model("villa", VillaSchema);

export { Villa }
