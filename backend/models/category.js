import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);
export default Category;
