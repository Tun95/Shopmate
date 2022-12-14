import mongoose from "mongoose";

const wishSchema = new mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    image: { type: String },
    price: { type: Number },
    isWished: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);



const Wish = mongoose.model("Wish", wishSchema);
export default Wish;
