import mongoose from 'mongoose'


const VilageSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    district_id:{
        type: String,
    },
    name : {
        type: String,
    },
    alt_name : {
        type: String,
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
}, {
    timestamps:true,
    versionKey:false
});

const Vilages = mongoose.model("location_vilages", VilageSchema);
export { Vilages }
