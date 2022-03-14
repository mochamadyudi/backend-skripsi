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
    resource_type: {type: String},
    format: {type:String},
    bytes: {type:String},
    prefix: {type: String},
    url: {type: String},
    public_id: {type:String},


})
const VideoSchema = new mongoose.Schema({
    name: {type:String},
    original_filename: {type: String},
    resource_type: {type: String},
    format: {type:String},
    bytes: {type:String},
    prefix: {type: String},
    url: {type: String},
    public_id: {type:String},
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
        name: {type:String,default:null},
        original_filename: {type: String,default:null},
        resource_type: {type: String,default:null},
        format: {type:String,default:null},
        bytes: {type:String,default:null},
        prefix: {type: String,default:null},
        url: {type: String,default:null},
        public_id: {type:String,default:null},
    },
    photo: {
        type:Array,
        default: [PhotoSchema]
    },
    video: {
        type:Array,
        default:[VideoSchema]
    },
    facility: {
        type: String,
        default: null,
    },
    location: {
        lat: {
            type: String,
            default: null,
        },
        long: {
            type: String,
            default: null
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
