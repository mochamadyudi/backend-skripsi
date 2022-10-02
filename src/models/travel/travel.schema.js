const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeriodsSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        default: 'sunday',
    },
    is_closed: {
        type: Boolean,
        default: false,
    },
    open_time: {
        type: Date,
        default: null
    },
    close_time: {
        type: Date,
        default: null
    },
});

const PhotoSchema = new mongoose.Schema({
    name: {type: String},
    original_filename: {type: String},
    prefix: {type: String},
    url: {type: String},
})
const VideoSchema = new mongoose.Schema({
    name: {type: String},
    original_filename: {type: String},
    prefix: {type: String},
    url: {type: String}
})

const FacilitySchema = new mongoose.Schema({
    gazebo: {
        type: Boolean,
        default: false,
    },
    hall: {
        type: Boolean,
        default: false,
    },
    meeting_room: {
        type: Boolean,
        default: false,
    },
    parking: {
        type: Boolean,
        default: false,
    },
})

//Option to not delete posts, this is why we're using this
const TravelSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default:null,
    },
    name: {
        type: String,
        default:null,
    },
    slug: {
        type: String,
        default: null,
        unique:true
    },
    thumbnail: {

        prefix: {
            type: String,
            default: process.env.PREFIX_URL
        },
        url: {type: String, default: null},
    },
    photo: [PhotoSchema],
    video: [VideoSchema],
    facility: FacilitySchema,
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "travel_category"
        }
    ],
    locations:{
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        provinces:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_provinces",
            default:null,
        },
        regencies:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_regencies",
            default:null,
        },
        districts:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_districts",
            default:null,
        },
        sub_districts:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"location_vilages",
            default:null,
        },
        address:{
            type: String,
            default: null
        },
        coordinates: {
            type: [Number],
            required:true,
        },
        zip_code:{
            type:Number,
            default:null
        }

    },
    bio: {
        type: String,
        default: null,
    },
    periods: [PeriodsSchema],
    is_free: {
        type: Boolean,
        default: true,
    },
    price: {
        specials: {
            type: Number,
            default: null
        },
        regular: {
            type: Number,
            default: 0
        },
        family: {
            type: Number,
            default: null
        },
        discount: {
            type: Number,
            default: 0
        }
    },
    is_published: {
        type: Number,
        enum: [-1, 0, 1], // -1 = draft | 0 = pending | 1 = published
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    seen:{
        type: Number,
        default: 0
    },
    rating:[
        {
            user: {
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            rate:{
                type:Number,
                default:0
            },
            date: {
                type: Date,
                default: Date.now
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

TravelSchema.index({locations:"2dsphere"})

const Travel = mongoose.model('travel', TravelSchema)

// Travel.createIndexes({})
// Travel.syncIndexes({'locations':"2dsphere"})
export {Travel}
