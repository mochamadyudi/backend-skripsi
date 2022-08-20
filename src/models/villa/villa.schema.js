import {makeIdRandom} from "@yuyuid/utils";
import moment from 'moment'

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
const rates = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    rate:{
        type: Number,
        default:0,
    },
    date: {
        type: Date,
        default: moment().utc().format("YYYY-MM-DD HH:mm:ss")
    }
})


const VillaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    rates:[rates],
    likes: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"user"
            }
        }
    ],
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
        coordinates: {
            type: [Number],
            required:true,
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
    facility: {
        ac: {
            type: Boolean,
            default:false
        },
        tv: {
            type: Boolean,
            default:false
        },
        hall: {
            type: Boolean,
            default:false
        },
        gazebo: {
            type: Boolean,
            default:false
        },
        wifi: {
            type: Boolean,
            default:false
        },
        swimming_pool: {
            type: Boolean,
            default:false
        },
        parking: {
            type: Boolean,
            default:false
        },
        meeting_room: {
            type: Boolean,
            default:false
        },
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

VillaSchema.virtual('villa-profiles', {
    ref: 'user',
    localField: 'user', // Of post collection
    foreignField: '_id',    // Of user collection
    justOne: true
})
let Villa = mongoose.model("villa", VillaSchema, );

export { Villa }
