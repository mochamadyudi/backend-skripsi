import moment from "moment";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import strpad from 'strpad'
import {hashUuid} from "@yuyuid/utils";

const Order = new Schema({
    hashId:{
        type:String,
        required:true,
        require:true,
    },
    uuid:{
        type:String,
        default: (_)=> {
            return hashUuid()
        }
    },
    order_number:{
        type: String,
        default:null
    },
    order_code: {
        type: String,
        default:null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"room",
        required:true
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
    expiresIn: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps:true,
    versionKey:false
});

Order.pre('save', async function(next){
    let count =await OrderSchema.count()
    let bigCount = strpad.left(count + 1,7,"0")
    this.order_code = bigCount
    this.order_number = [bigCount,moment().format("MM/YYYY")].join("/")
    next();
})
const OrderSchema = mongoose.model('order', Order)
export {OrderSchema}
