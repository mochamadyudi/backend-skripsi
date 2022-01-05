const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Option to not delete posts, this is why we're using this
const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    is_open: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const CartInfo = mongoose.model("cart_info", CartSchema);

export { CartInfo }
