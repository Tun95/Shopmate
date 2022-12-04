import express from "express";
import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import { isAuth } from "../utils.js";

const cartRouter = express.Router();

//CREATE
cartRouter.post(
  "/",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const cart = await Cart.create({
        name: req.body.name,
        slug: req.body.slug,
        keygen: req.body.keygen,
        image: req.body.image,
        color: req.body.color,
        size: req.body.size,
        quantity: req.body.quantity,
        price: req.body.price,
        // user: req.user._id,
      });
      res.send(cart);
    } catch (error) {
      res.send(error);
    }
  })
);

//FETCH ALL
cartRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const cartItems = await Cart.find({}).populate("user").sort("-createdAt");
      res.send(cartItems);
    } catch (error) {
      res.send(error);
    }
  })
);

//UPADTE
cartRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await Cart.findOneAndUpdate(
        id,
        {
          quantity: req.body.quantity,
        },
        { new: true }
      );
      res.send(cart);
    } catch (error) {
      res.send(error);
    }
  })
);

//DELETE
cartRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await Cart.findByIdAndDelete(id);
      res.send(cart);
    } catch (error) {
      res.send(error);
    }
  })
);

//CART CLEAR
cartRouter.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    await Cart.remove({});
    const clearCart = await Cart.deleteMany({});

    res.send(clearCart);
  })
);

export default cartRouter;
