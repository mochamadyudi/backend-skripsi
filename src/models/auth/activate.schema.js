const mongoose = require("mongoose");
const ActivationScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"refType"
    },
    refType: {
        type: String,
        required: true,
        enum: ['user',"user_villa"]
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
    updated_at: {
        type: Date,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Activations = mongoose.model("activations", ActivationScheme);

export { Activations }
