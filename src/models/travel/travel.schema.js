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
        ref: "user"
    },
    travel_name: {
        type: String
    },
    slug: {
        type: String,
        default: null
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
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "travel_category"
            },
            hash_id: {
                type: String,
                default: null,
            },
            name: {
                type: String,
                default: null
            },
            slug: {
                type: String,
                default: null
            },
            createdAt: {
                type: String,
                default:null,
            },
            updatedAt: {
                type: String,
                default: null
            }
        }
    ],
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

const Travel = mongoose.model('travel', TravelSchema)

export {Travel}
