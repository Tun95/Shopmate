import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    address: { type: String },
    country: { type: String },
    image: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number },
      numReviews: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

//Virtual method to populate created post
userSchema.virtual("products", {
  ref: "Product",
  foreignField: "user",
  localField: "_id",
});

const User = mongoose.model("User", userSchema);
export default User;
