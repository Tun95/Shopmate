import express from "express";
import expressAsyncHandler from "express-async-handler";
import Wish from "../models/wishModel.js";
import { isAuth } from "../utils.js";

const wishRouter = express.Router();

//CREATE
wishRouter.post(
  "/",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const wish = await Wish.create({
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.image,
        price: req.body.price,
        checked: req.body.checked,
        user: req.user._id,
      });
      res.send(wish);
    } catch (error) {
      res.send(error);
    }
  })
);

//FETCH ALL
wishRouter.get(
  "/:id/wishlist",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params.user;
    try {
      const wishList = await Wish.findOne({ id }).sort("-createdAt");
      res.send(wishList);
    } catch (error) {
      res.send(error);
    }
  })
);

//UPADTE
wishRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const wish = await Wish.findOneAndUpdate(
        id,
        {
          quantity: req.body.quantity,
        },
        { new: true }
      );
      res.send(wish);
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
