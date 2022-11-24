import express from "express";
import expressAsyncHandler from "express-async-handler";
import Sib from "sib-api-v3-sdk";
import EmailMsg from "../models/emailMessaging.js";
import { isAdmin, isAuth } from "../utils.js";

const sendEmailRouter = express.Router();

//Contact Admin
sendEmailRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

    const { email, name, subject, message } = req.body;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email,
      name,
    };
    const receivers = [
      {
        email: process.env.EMAIL_ADDRESS,
      },
    ];
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject,
        textContent: message,
        params: {
          role: "Frontend",
        },
      })
      .then(console.log)
      .catch(console.log);
    res.json("sent");
  })
);

//Subscribe to News Letter
sendEmailRouter.post(
  "/subscribe",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const emailExist = await EmailMsg.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const subscribe = await EmailMsg.create({
      email: req.body.email,
      //user: req.user._id,
    });
    res
      .status(200)
      .send({ message: "You have successfully subscribe to our newsletter" });
    console.log(subscribe);
  })
);

//Send News Letter email
sendEmailRouter.post(
  "/send",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    // EmailMsg.find({}, function (err, allSubscribers) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   const mailList = [];
    //   allSubscribers.forEach(function (subscribers) {
    //     mailList.push(subscribers.email);
    //     return mailList;
    //   });

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

    const { subject, message } = req.body;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: process.env.EMAIL_ADDRESS,
      name: process.env.SHOP_NAME,
    };
    const receivers = [
      {
        email: [],
      },
    ];
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject,
        textContent: message,
        params: {
          role: "Frontend",
        },
      })
      .then(console.log)
      .catch(console.log);
    res.json("sent");
  })
);

export default sendEmailRouter;
