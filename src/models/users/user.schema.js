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
    is_verify: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  },
});

UserSchema.virtual('villa-likes', {
    ref: 'villa_likes',
    localField: '_id',
    foreignField: 'user'
});
UserSchema.virtual('user-profiles',{
    ref: 'users_profile',
    localField: '_id', // Of post collection
    foreignField: 'user',    // Of user collection
    justOne: true
})
UserSchema.virtual('user_villa_profiles',{
    ref: 'villa',
    localField: '_id', // Of post collection
    foreignField: 'likes',    // Of user collection
    justOne: true
})
const User = mongoose.model("user", UserSchema);

export { User }
