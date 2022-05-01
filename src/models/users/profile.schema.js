const mongoose = require("mongoose");

const patientTextSchema = new mongoose.Schema({
    zipCode:{
        type: String,
        default :null
    },
    street:{
        type: String,
        default :null
    },
    city: {
        type: String,
        default :null
    },
    province: {
        type: String,
        default :null
    },
});

//Create reference to user model, associated with _id in database
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    contact:{
        type: Number,
        default :null
    },
    address: [patientTextSchema],

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
    status: {
        type: String,
        default :null
    },
    bio: {
        type: String,
        default :null
    },
    social: {
        twitter: {
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
    date: {
        type: Date,
        default: Date.now
    }
});

const Profile =  mongoose.model("users_profile", ProfileSchema);
export { Profile }
