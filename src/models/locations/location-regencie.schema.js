import mongoose from 'mongoose'


const RegenciesSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    province_id:{
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

const Regencies = mongoose.model("location_regencies", RegenciesSchema);
export { Regencies }
