import express from "express";

import bcrypt from "bcryptjs";

import expressAsyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

//TOP SELLERS
userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({
        "seller.rating": -1,
      })
      .limit(3);
    res.send(topSellers);
  })
);

// USER INFO FETCHING
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate("products");
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
//USER SIGNIN
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

//USER SIGNUP
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(user),
    });
  })
);

//USER PROFILE UPDATE
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.image = req.body.image || user.image;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.country = req.body.country || user.country;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        phone: updatedUser.phone,
        address: updatedUser.address,
        country: updatedUser.country,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

//ADMIN USER LIST FETCHING
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).sort("-createdAt");
    res.send(users);
  })
);

//ADMIN USER DELETE
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted Successfuly" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//ADMIN USER UPDATE
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.country = req.body.country || user.country;
      user.image = req.body.image || user.image;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isSeller = Boolean(req.body.isSeller);
      const updatedUser = await user.save();
      res.send({ message: "User Updated Successfully", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
