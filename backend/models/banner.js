import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Your Banner Title",
    },
    background: {
      type: String,
      default:
        "https://res.cloudinary.com/dstj5eqcd/image/upload/v1673724164/banner2_l71yuh.png",
    },
    descriptions: {
      type: String,
      default: "Banner descriptions",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
