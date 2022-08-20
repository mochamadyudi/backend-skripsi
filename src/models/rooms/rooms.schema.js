import {makeIdRandom} from "@yuyuid/utils";
import moment from 'moment'
import mongoose from 'mongoose'
// const mongoose = require("mongoose");
const images = new mongoose.Schema({
    path:{
        type: String,
        default :null
    },
    filename: {
        type: String,
        default :null
    },
    destination:{
        type: String,
        default :null
    },
    resize_active:{
        type: Array,
        default :[]
    },
    prefix_url:{
        type: String,
        default :null
    },
    originalname:{
        type: String,
        default :null
    },
    format:{
        type: String,
        default :null
    },

});

const schedules = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            default: null,
        },
        date: {
            type: Date,
            default:null,
        },
        total: {
            type: Number,
            default:1,
        },
        total_unit:{
            type: String,
            enum: ['day','week','month']
        },
        expiresIn: {
            type: Date,
            default:null,
        },
        limit: {
            type: Number,
            default: 1
        },
    },
)
const RoomSchema = new mongoose.Schema({
    villa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "villa",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    wishlists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room_wishlists",
        default:null,
    },
    schedule: [schedules],
    type: {
        type: String,
        enum: ['superior', 'deluxe', 'junior', 'presidential', 'single', 'twin', 'standard', 'suite', 'double', 'triple']
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    images: [images],
    limit: {
        type: Number,
        default: 1
    },
    price: {
        regular: {
            type: Number,
            default: 0,
            required: true
        },
        special: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        }
    },
    unit: {
        type: String,
        enum : ["day","month","year"],
        default: "day"
    },
    currency: {
        type: String,
        enum: ["$","Rp"],
        default: "Rp"
    },
    facility: {
        ac: {
            type: Boolean,
            default: false
        },
        tv: {
            type: Boolean,
            default: false
        },
        bed_type: {
            type: String,
            enum: ["single","double","large","extra-large"],
            default:"single"
        },
        wifi: {
            type: Boolean,
            default: false
        },
        smoking: {
            type: Boolean,
            default: false
        },
        other: {
            type: String,
            default:null,
        }
    },
    is_available: {
        type: Boolean,
        default: true
    },
    status:{
        type: Number,
        enum: [-1,0,1,2,3], // -1 = ditolak  | 0 = pending | 1 = waiting confirm | 2 = confirmed | 3 = publish
        default:-1,
    },
    seen: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

const Room = mongoose.model("room", RoomSchema);

export {Room}
