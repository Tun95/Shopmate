import express from "express";
import expressAsyncHandler from "express-async-handler";
import Wish from "../models/wishModel.js";
import { isAuth } from "../utils.js";

const wishRouter = express.Router();

//CREATE
wishRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const alreadyExist = await Wish.findOne({ slug: req.body.slug });
    if (alreadyExist) {
      throw new Error("Already added to your wish list");
    }
    try {
      const wish = await Wish.create({
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.image,
        price: req.body.price,
        checked: req.body.checked,
        user: req.user._id,
        product: req.body.product,
      });
      res.send(wish);
    } catch (error) {
      res.send(error);
    }
  })
);

//FETCH ALL
wishRouter.get(
  "/",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const wishLists = await Wish.find({})
        .sort("-createdAt")
        .populate("user product");
      res.send(wishLists);
    } catch (error) {
      res.send(error);
    }
  })
);

//DELETE
wishRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const wish = await Wish.findByIdAndDelete(id);
      res.send(wish);
    } catch (error) {
      res.send(error);
    }
  })
);

export default wishRouter;
