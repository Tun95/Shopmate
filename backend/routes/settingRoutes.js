import express from "express";
import expressAsyncHandler from "express-async-handler";
import Settings from "../models/settings.js";
import { isAuth } from "../utils.js";

const settingsRoutes = express.Router();

//create
settingsRoutes.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const other = await Settings.create({
        title: req.body.title,
        user: req.user._id,
        description: req.body.description,
      });
      res.send(other);
    } catch (error) {
      res.send(error);
    }
  })
);

//Fetch all
settingsRoutes.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const other = await Settings.find({}).populate("user").sort("-createdAt");
      res.send(other);
    } catch (error) {
      res.send(error);
    }
  })
);

//Fetch single
settingsRoutes.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const other = await Settings.findById(id);
      res.send(other);
    } catch (error) {
      res.send(error);
    }
  })
);

//Update
settingsRoutes.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const other = await Settings.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true }
      );
      res.send(other);
    } catch (error) {
      res.send(error);
    }
  })
);

//Fetch single
settingsRoutes.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const other = await Settings.findByIdAndDelete(id);
      res.send(other);
    } catch (error) {
      res.send(error);
    }
  })
);

export default settingsRoutes;
