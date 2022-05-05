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
    name: {type:String},
    original_filename: {type: String},
    prefix: {type: String},
    url: {type: String},
})
const VideoSchema = new mongoose.Schema({
    name: {type:String},
    original_filename: {type: String},
    prefix: {type: String},
    url: {type: String}
})

const FacilitySchema = new mongoose.Schema( {
    ac: {
        type: Boolean,
        default:false,
    },
    gazebo: {
        type: Boolean,
        default:false,
    },
    hall: {
        type: Boolean,
        default:false,
    },
    meeting_room: {
        type: Boolean,
        default:false,
    },
    parking: {
        type: Boolean,
        default:false,
    },
    swimming_pool: {
        type: Boolean,
        default:false,
    },
    tv: {
        type: Boolean,
        default:false,
    },
    wifi: {
        type: Boolean,
        default:false,
    },
})

//Option to not delete posts, this is why we're using this
const TravelSchema = new Schema({
    travel_name: {
        type: String
    },
    slug:{
        type: String,
        default:null
    },
    hash_id: {
        type: String,
        default: null
    },
    thumbnail: {
        captions: {
            type: String,
            default:null,
        },
        name: {type:String,default:null},
        original_filename: {type: String,default:null},
        prefix: {type: String,default:null},
        url: {type: String,default:null},
    },
    photo: {
        type:Array,
        default: [PhotoSchema]
    },
    video: {
        type:Array,
        default:[VideoSchema]
    },
    facility: FacilitySchema,
    location: {
        country: {
            type: String,
            default:null,
        },
        province: {
            type:String,
            default:null,
        },
        city: {
            type: String,
            default:null
        },
        district: {
            type: String,
            default: null
        },
        sub_district: {
            type: String,
            default:null
        },
        zip_code: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default:null,
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
    bio: {
        type: String,
        default:null,
    },
    periods: {
        type:Array,
        default:[PeriodsSchema]
    },
    price:{
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
        discount:{
            type: Number,
            default: 0
        }
    },
    is_published: {
        type: Number,
        enum: [-1,0,1], // -1 = draft | 0 = pending | 1 = published
        default:0
    },
    is_deleted:{
        type: Boolean,
        default:false
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Travel = mongoose.model('travel', TravelSchema)

export {Travel}
