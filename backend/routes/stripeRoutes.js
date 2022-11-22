import express from "express";
import stripe from "stripe"

// const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripeEnv = (stripe)(process.env.STRIPE_KEY);

const stripeRouter = express.Router();
stripeRouter.post("/payment", (req, res) => {
  stripeEnv.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

export default stripeRouter;
