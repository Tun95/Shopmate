import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    about: {
      type: String,
      default: "Your About here",
    },
    terms: {
      type: String,
      default: "Your terms here",
    },
    returns: {
      type: String,
      default: "Your return here",
    },
    privacy: {
      type: String,
      default: "Your privacy here",
    },
    currency: {
      type: String,
      default: "GBP",
    },
    currencySign: {
      type: String,
      default: "£",
    },
    tax: {
      type: String,
      default: 14,
    },
    shipping: {
      type: String,
      default: 24,
    },
    express: {
      type: String,
      default: "Your express here",
    },
    expressCharges: {
      type: String,
      default: "Your express here",
    },
    standard: {
      type: String,
      default: "Your standard here",
    },
    standardCharges: {
      type: String,
      default: "Your standard charges here",
    },
    facebook: {
      type: String,
      default: "https://web.facebook.com/",
    },
    twitter: {
      type: String,
      default: "https://twitter.com/",
    },
    youtube: {
      type: String,
      default: "https://youtube.com/",
    },
    instagram: {
      type: String,
      default: "https://www.instagram.com/",
    },
    pinterest: {
      type: String,
      default: "https://www.pinterest.com/",
    },
    webname: {
      type: String,
      default: "SHOPMATE",
    },
    bannerBackground: {
      type: String,
      default:
        "https://res.cloudinary.com/dstj5eqcd/image/upload/v1673724164/banner2_l71yuh.png",
    },
    sizeGuide: {
      type: String,
      default: "size guidelines",
    },
    reviewGuide: {
      type: String,
      default: "review guidelines",
    },
    navOne: {
      type: String,
      default: "Women",
    },
    navTwo: {
      type: String,
      default: "Men",
    },
    navThree: {
      type: String,
      default: "Kids",
    },
    navFour: {
      type: String,
      default: "Shoes",
    },
    navFive: {
      type: String,
      default: "Brand",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
