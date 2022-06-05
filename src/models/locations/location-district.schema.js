import mongoose from 'mongoose'


const DistrictSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    regency_id:{
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

const Districts = mongoose.model("location_districts", DistrictSchema);
export { Districts }
