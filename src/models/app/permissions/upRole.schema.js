const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpRoleSchema = new mongoose.Schema({
    role:{
        type: Number,
        default: 1,
    },
    slug: {
        type: String,
        default:"admin"
    },
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

const UpRole = mongoose.model("up_role", UpRoleSchema);

export { UpRole }
