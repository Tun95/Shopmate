import express from "express";
import expressAsyncHandler from "express-async-handler";
import Sib from "sib-api-v3-sdk";

const sendEmailRouter = express.Router();

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

sendEmailRouter.post(
  "/subscribe",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

    let apiInstance = new Sib.ContactsApi();
    let createContact = new Sib.CreateContact();
    createContact.email = email;
    createContact.listIds = [2];

    // call SIB api
    apiInstance.createContact(createContact).then(
      (data) => {
        // success
        res.status(200).send({
          msg: "You have successfully subscribe to our newsletter",
        });
        console.log(data);
      },
      function (error) {
        // error
        console.log(error);
        res.status(500).send({ error: "Email already exists" });
      }
    );
  })
);

export default sendEmailRouter;
