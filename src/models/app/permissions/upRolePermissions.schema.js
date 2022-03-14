const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpRolePermissionsSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "up_roles"
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

const UpRolePermissions = mongoose.model("up_role_permissions", UpRolePermissionsSchema);

export { UpRolePermissions }
