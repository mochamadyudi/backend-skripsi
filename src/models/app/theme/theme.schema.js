const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThemeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    use_theme:{
        type: Number,
        default: 1,
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

const ThemeApp = mongoose.model("theme_app", ThemeSchema);

export { ThemeApp }
