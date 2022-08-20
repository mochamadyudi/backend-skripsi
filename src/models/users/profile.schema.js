const mongoose = require("mongoose");

const patientTextSchema = new mongoose.Schema({
    zipCode: {
        type: String,
        default: null
    },
    street: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    province: {
        type: String,
        default: null
    },
});

//Create reference to user model, associated with _id in database
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    birthday:{
        date: {
            type: Date,
            default : null
        },
        place: {
            type: String,
            default: null,

        }
    },
    thumbnail: {
        type: String,
        default: null,
    },
    cover: {
        type: String,
        default: null
    },
    photos: [],
    contact: {
        type: Number,
        default: null
    },
    address: [patientTextSchema],
    is_admin: {
        type: Boolean,
        default: false,
    },
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
    status: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    social: {
        twitter: {
            type: String,
            default: null
        },
        facebook: {
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
        }
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
    },
    updated_at: {
        type: Date,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  },
});

ProfileSchema.virtual('profiles',{
    ref: 'user',
    localField: 'user', // Of post collection
    foreignField: '_id',    // Of user collection
    justOne: true
})
const Profile = mongoose.model("users_profile", ProfileSchema);
export {Profile}
