import moment from "moment";

const mongoose = require("mongoose");
const ForgotPasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"user"
    },
    ip_address: {
        type: String,
        default: null,
    },
    token : {
        type: String,
        required: true,
        unique: true
    },
    expiredOn: {
      type: Date,
        default:null
    },
    date: {
        type: Date,
        default: Date.now
    }
},{versionKey:false});

const ForgotPassword = mongoose.model("forgot_password", ForgotPasswordSchema);

export { ForgotPassword }
