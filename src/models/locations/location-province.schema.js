import moment from "moment";
import mongoose from 'mongoose'


const ProvincesSchema = new mongoose.Schema({
    id: {
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

const Provinces = mongoose.model("location_provinces", ProvincesSchema);
export { Provinces }
