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

    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Virtual method to populate created post
productSchema.virtual("wish", {
  ref: "Wish",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
