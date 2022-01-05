const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    data:[],
    is_deleted:{
        type: Boolean,
        default:false,
    },
    updated_at:{
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const SettingUser = mongoose.model("setting_user", CheckoutSchema);

export { SettingUser }
