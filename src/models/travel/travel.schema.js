const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeriodsSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        default: 'sunday',
    },
    open_start: {
        type: String,
        default: null
    },
    close_end: {
        type: String,
        default: null
    },
});

//Option to not delete posts, this is why we're using this
const TravelSchema = new Schema({
    travel_name: {
        type: String
    },

    images: {
        type: Array,
        default: []
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
    travel_detail: {
        type: String,
        default:null,
    },
    periods: [PeriodsSchema],
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
    date: {
        type: Date,
        default: Date.now
    }
});

const Travel = mongoose.model('travel', TravelSchema)

export {Travel}