import mongoose from "mongoose";

const wishSchema = new mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    image: { type: String },
    price: { type: Number },
    checked: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const Wish = mongoose.model("Wish", wishSchema);
export default Wish;
