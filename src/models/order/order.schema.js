const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import strpad from 'strpad'

//Option to not delete posts, this is why we're using this
const Order = new Schema({
    hashId:{
        type:String,
        required:true,
        require:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"room",
    },
    status:{
        type: String,
        enum: ['waiting','unpaid','paid','cancel','expired']
    },
    amount:{
        type: Number,
        required:true
    },
    limit: {
        type: Number,
        default:1,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps:true,
    versionKey:false
});


const OrderSchema = mongoose.model('order', Order)

export {OrderSchema}
