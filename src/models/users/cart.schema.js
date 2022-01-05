const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Option to not delete posts, this is why we're using this
const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    rooms:{
        type:Array,
        default: []
    },
    travels:{
        type:Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model("cart", CartSchema);

export { Cart }
