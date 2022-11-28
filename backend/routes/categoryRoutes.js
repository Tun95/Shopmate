import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/category.js";
import { isAuth } from "../utils.js";

const categoryRoutes = express.Router();

//create
categoryRoutes.post(
  "/",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.create({
        category: req.body.category,
        // user: req.user._id,
      });
      res.send(category);
    } catch (error) {
      res.send(error);
    }
  })
);

//Fetch all
categoryRoutes.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const categories = await Category.find({})
        .populate("user")
        .sort("-createdAt");
      res.send(categories);
    } catch (error) {
      res.send(error);
    }
  })
);

//Fetch single
categoryRoutes.get(
  "/:id",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      res.send(category);
    } catch (error) {
      res.send(error);
    }
  })
);

//Update
categoryRoutes.put(
  "/:id",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true }
      );
      res.send(category);
    } catch (error) {
      res.send(error);
    }
  })
);

//Delete single
categoryRoutes.delete(
  "/:id",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      res.send(category);
    } catch (error) {
      res.send(error);
    }
  })
);

export default categoryRoutes;
