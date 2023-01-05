import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    slug: { type: String, required: true },
    keygen: { type: String, required: true },
    gender: { type: String, required: true },
    category: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    numSales: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    brand: { type: Array },
    image: { type: String, required: true },
    images: [String],
    desc: { type: String },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    numWishList: { type: mongoose.Schema.Types.ObjectId, ref: "Wish" },
    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isWished: {
      type: Boolean,
      default: false,
    },
    isUnWished: {
      type: Boolean,
      default: false,
    },
    wished: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unWished: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
