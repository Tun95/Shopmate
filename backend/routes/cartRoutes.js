import expressAsyncHandler from "express-async-handler";
import express from "express";

const cartRoutes = express.Router();

cartRoutes.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    res.send("Cart");
  })
);

export default cartRoutes;
