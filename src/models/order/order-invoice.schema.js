import moment from "moment";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import strpad from 'strpad'


//Option to not delete posts, this is why we're using this
const OrderInvoice = new Schema({
    hashId:{
        type:String,
        required:true,
        require:true,
    },
    invoice_number:{
        type: String,
        default:null
    },
    invoice_date: {
        type: Date,
        default : moment(),
    },
    invoice_due_date: {
        type: Date,
        default: moment().add(23,'hour')
    },
    invoice_total: {
        type: Number,
        default: 0
    },
    invoice_sub_total: {
        type: Number,
        default:0
    },
    invoice_tax: {
        type: String,
    },
    payment_code: {
        type: String,
    },
    payment_company_code: {
        type: String,
    },
    status: {
        type: String
    },
    invoice_notes:{
        type: String,

    }
}, {
    timestamps:true,
    versionKey:false
});

OrderInvoice.pre('save', async function(next){
    let count =await OrderInvoiceSchema.count()
    let bigCount = strpad.left(count + 1,7,"0")
    this.invoice_number = [bigCount,moment().format("MM/YYYY")].join("/")
    next();
})
const OrderInvoiceSchema = mongoose.model('order_invoice', OrderInvoice)
export {OrderInvoiceSchema}
