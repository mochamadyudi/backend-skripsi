const mongoose = require("mongoose");
const VillaThemeSchema = new mongoose.Schema({
    villa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "villa"
    },

    theme_type: {
        type: Number,
        default: 1,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const VillaTheme = mongoose.model("villa_theme", VillaThemeSchema);

export { VillaTheme }
