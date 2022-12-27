import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModels.js";
import User from "../models/userModels.js";
import { isAuth, isAdmin, isSellerOrAdmin } from "../utils.js";
import nodemailer from "nodemailer";
import Sib from "sib-api-v3-sdk";
import Product from "../models/productModels.js";
import Razorpay from "razorpay";
import Stripe from "stripe";

const orderRouter = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    // const sellerFilter = seller ? { seller } : {};
    const sellerFilter = seller && seller !== "all" ? { seller } : {};
    const orders = await Order.find({ ...sellerFilter })
      .populate("user", "name")
      .sort("-createdAt");
    res.send(orders);
  })
);

//ORDER INFO
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      seller: req.body.orderItems[0].seller,
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      //paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      grandTotal: req.body.grandTotal,
      user: req.user._id,
      product: req.body.orderItems.product,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

//ADMIN ORDER LIST
const PAGE_SIZE = 10;
orderRouter.get(
  "/admin",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const seller = query.seller || "";
    const order = query.order || "";
    const pageSize = query.pageSize || PAGE_SIZE;

    const sellerFilter = seller ? { seller } : {};
    //const sellerFilter = seller && seller !== "all" ? { seller } : {};

    const sortOrder = order === "featured" ? { createdAt: -1 } : { _id: -1 };

    const orders = await Order.find({
      ...sellerFilter,
    })
      .populate("user", "name")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countOrders = await Order.countDocuments({
      ...sellerFilter,
    });

    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

//ORDER SUMMARY
orderRouter.get(
  "/summary",
  // isAuth,
  // isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req?.query.id;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
    console.log(productId);
    //GET MONTLY ORDERS
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$grandTotal",
        },
      },
      {
        $group: {
          _id: "$month",
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$sales" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 2 },
    ]);

    //GET MONTHLY USERS STATS
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          numUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 2 },
    ]);

    //GET DAILY INCOME
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          numOrders: { $sum: 1 },
          sales: { $sum: "$grandTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //GET MONTHLY INCOME
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$grandTotal",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({ users, orders, income, dailyOrders });
  })
);

//TEST
orderRouter.get(
  "/spent",
  expressAsyncHandler(async (req, res) => {
    const income = await Order.aggregate([
      { $match: {} },
      { $group: { _id: "$user", total: { $sum: "$grandTotal" } } },
    ]);
    res.send(income);
  })
);

//FETCH ALL INDIV. ORDER
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.send(orders);
  })
);

//FETCH ORDER DETAILS
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.send(404).send({ message: "Order Not Found" });
    }
  })
);

//DELIVER ORDER
orderRouter.put(
  "/:id/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order No Found" });
    }
  })
);

//RAZORPAY CREATE ORDER
orderRouter.post(
  "/stripe-create",
  expressAsyncHandler(async (req, res) => {
    try {
      const instance = new Stripe({
        key_id: process.env.STRIPE_PUBLISHABLE_KEY,
        key_secret: process.env.STRIPE_SECRET_KEY,
      });
      const options = {
        amount: req.body.amount,
        currency: "GBP",
      };
      const order = await instance.orders.create(options);
      if (!order) return res.status(500).send("Some error occured");
      res.send(order);
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

//RAZORPAY
// orderRouter.put(
//   "/:id/stripepay",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
//       //   req.body;
//       const newPayment = Order({
//         isPaid: true,
//         paidAt: Date.now(),
//         paymentResult: {
//           id: req.body.id,
//           status: req.body.status,
//           update_time: req.body.update_time,
//           email_address: req.body.email_address,
//         },
//       });
//       await newPayment.save();
//       res.send({
//         msg: "Payment was successfull",
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(error);
//     }
//   })
// );

//PAYMENT
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      for (const index in order.orderItems) {
        const item = order.orderItems[index];
        const product = await Product.findById(item.product);
        product.countInStock -= item.quantity;
        product.numSales += item.quantity;
        await product.save();
      }

      const updatedOrder = await order.save();

      const payOrderEmailTemplate = `<!DOCTYPE html><html><body><h1>Thanks for shopping with us</h1>
        <p>
        Hi ${order.user.name},</p>
        <p>We have finished processing your order.</p>
        <h2>[Order ${order._id}] (${order.createdAt
        .toString()
        .substring(0, 10)})</h2>
        <table>
        <thead>
        <tr>
        <td><strong>Product</strong></td>
        <td><strong>Keygen</strong></td>
        <td><strong>Size</strong></td>
        <td><strong>Color</strong></td>
        <td><strong>Quantity</strong></td>
        <td><strong align="right">Price</strong></td>
        </thead>
        <tbody>
        ${order.orderItems
          .map(
            (item) => `
          <tr>
          <td>${item.name}</td>
          <td align="left">${item.keygen}</td>
          <td align="left">${item.size || ""}</td>
          <td align="center"><i className=${item.color || ""}></i></td>
          <td align="center">${item.quantity}</td>
          <td align="right"> £${item.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join("\n")}
        </tbody>
        <tfoot>
        <tr>
        <td colspan="2">Items Price:</td>
        <td align="right"> £${order.itemsPrice.toFixed(2)}</td>
        </tr>
        <tr>
        <td colspan="2">Tax Price:</td>
        <td align="right"> £${order.taxPrice.toFixed(2)}</td>
        </tr>
        <tr>
        <td colspan="2">Shipping Price:</td>
        <td align="right"> £${order.shippingPrice.toFixed(2)}</td>
        </tr>
        <tr>
        <td colspan="2"><strong>Total Price:</strong></td>
        <td align="right"><strong> £${order.grandTotal.toFixed(2)}</strong></td>
        </tr>
        </table>
        <h2>Shipping address</h2>
        <p>
        ${order.shippingAddress.firstName},<br/>
        ${order.shippingAddress.lastName},<br/>
        ${order.shippingAddress.address},<br/>
        ${order.shippingAddress.city},<br/>
        ${order.shippingAddress.zipCode}<br/>
        ${order.shippingAddress.cState}<br/>
        ${order.shippingAddress.country},<br/>
        ${order.shippingAddress.shipping},<br/>
        </p>
        <hr/>
        <p>
        Thanks for shopping with us.
        </p>
        </body></html>`;
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        name: process.env.SHOP_NAME,
        email: process.env.EMAIL_ADDRESS,
      };
      const receivers = [
        {
          name: `${order.user.name}`,
          email: `${order.user.email}`,
        },
      ];
      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: `New Order ${order._id}`,
          htmlContent: payOrderEmailTemplate,
          params: {
            role: "Frontend",
          },
        })
        .then(console.log)
        .catch(console.log);

      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

//DELETING ORDERS
orderRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Order Deleted Successfully" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
export default orderRouter;
