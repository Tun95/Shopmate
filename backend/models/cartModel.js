import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    keygen: { type: String },
    image: { type: String },
    color: { type: Array },
    size: { type: Array },
    quantity: { type: Number },
    price: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
