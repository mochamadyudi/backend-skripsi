const mongoose = require("mongoose");

const rbacSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    privileges: [{
        resource: { type: String, required: true },
        actions: [{ type: String, required: true }]
    }]
}, {
    timestamps: false,
    versionKey: false
});

const privilegeSchema = new mongoose.Schema({
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, {
    timestamps: false,
    versionKey: false
});

const Privilege = mongoose.model('Privilege', privilegeSchema);



const Roles = mongoose.model('Role', rbacSchema);

Roles.events.on('error', err => console.log({
    error:err.message,
    model:"RBAC - Role"
}));

export { Roles,Privilege }
