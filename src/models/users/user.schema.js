const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ['customer','villa','admin']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt:{
        type: String,
    },
    avatar: {
        type: String
    },
    online:{
        type: Boolean,
        default: false
    },
    expires_in:{
        type:Date,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("user", UserSchema);

export { User }
