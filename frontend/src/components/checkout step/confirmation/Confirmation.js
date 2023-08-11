import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../../Context/Context";
import Footer from "../../../common/footer/Footer";
import { getError } from "../../Utilities/util/Utils";

import "./styles.css";
import CheckoutSteps from "../../Utilities/checkout/CheckoutSteps";
import { request } from "../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function Confirmation(props) {
  const { express, expressCharges, standardCharges, tax } = props;

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {
    userInfo,
    settings,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const itemsPrice = cartItems.reduce(
    (a, c) => a + (c.price - (c.price * c.discount) / 100) * c.quantity,
    0
  );
  const taxPrice = itemsPrice * tax;
  const shippingPrice =
    shippingAddress.shipping === express ? expressCharges : standardCharges;
  const grandTotal = (
    Number(itemsPrice) +
    Number(taxPrice) +
    Number(shippingPrice)
  ).toFixed(0);

  useEffect(() => {
    if (!shippingAddress.address || cartItems.length === 0) {
      navigate("/shipping?redirect");
    }
  }, [shippingAddress, navigate, cartItems]);
  const backHandler = () => {
    navigate("/shipping");
  };

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const placeOrderHandler = async () => {
    dispatch({ type: "CREATE_REQUEST" });
    if (!userInfo.isAccountVerified) {
      toast.error("Please verify your account to checkout", {
        position: "bottom-center",
      });
    } else {
      try {
        const { data } = await axios.post(
          `${request}/api/orders`,
          {
            orderItems: cartItems,
            shippingAddress,
            //paymentMethod,
            itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice,
            grandTotal,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        ctxDispatch({ type: "CART_CLEAR" });
        dispatch({ type: "CREATE_SUCCESS" });
        localStorage.removeItem("cartItems");
        navigate(`/payment/${data.order._id}`);
      } catch (err) {
        dispatch({ type: "CREATE_FAIL" });
        toast.error(getError(err), { position: "bottom-center" });
      }
    }
  };

  console.log(cartItems?.seller);
  return (
    <>
      <div className="con-confirmation">
        <Helmet>
          <title>Confirmation</title>
        </Helmet>
        <div className="con-section">
          <div className="header-check">
            <div className="c-check">
              <h2 className="box-check n-t-y">Checkout</h2>
              <h3 className="box-check-title ">Confirmation</h3>
              <div className="checkout">
                <CheckoutSteps step1 step2></CheckoutSteps>
              </div>
            </div>
          </div>
          <div className="section-tot">
            <div className="section-split">
              <div className="con-section-1">
                <h3>Order summary</h3>
                <div className="con-table">
                  <div className="con-table-header">
                    <ul>
                      <li className="con-item">Item</li>
                      <li className="con-quantity">Qty</li>
                      <li className="con-price">Price</li>
                    </ul>
                  </div>
                  <div className="con-table-body">
                    <div className="table-row">
                      <ul>
                        {cartItems.map((item, id) => (
                          <li className="item-list" key={id}>
                            <p className="item-name">{item.name}</p>
                            <span className="qty">{item.quantity}</span>
                            {settings?.map((s, index) => (
                              <span className="price" key={index}>
                                {item.discount ? (
                                  <div className="cart-price">
                                    {s.currencySign}
                                    {(
                                      item.price -
                                      (item.price * item.discount) / 100
                                    ).toFixed(0) * item.quantity}
                                  </div>
                                ) : (
                                  <div className="cart-price">
                                    {s.currencySign}
                                    {item.price.toFixed(0) * item.quantity}
                                  </div>
                                )}
                              </span>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="con-section-2">
                <h3>Delivery</h3>
                <div className="con-table-head">
                  <div className="con-header">
                    <span>Address</span>
                  </div>
                  <div className="dev-list">
                    <p className="address">
                      {shippingAddress.address},{shippingAddress.city},
                      {shippingAddress.zipCode},{shippingAddress.cState},
                      {shippingAddress.country}
                    </p>
                    <h4>Delivery options</h4>
                    <p className="d-stand">{shippingAddress.shipping}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="con-section-3">
              {settings?.map((s, index) => (
                <div className="con-3" key={index}>
                  <div>
                    <button disabled>TAXPRICE {s.tax}%</button>
                  </div>
                  <div className="list-shipping">
                    <ul>
                      <li className="drag">
                        <h4>Subtotal</h4>
                        <span>
                          {s.currencySign}
                          {itemsPrice.toFixed(0)}
                        </span>
                      </li>
                      <li className="drag">
                        <h4>Shipping</h4>{" "}
                        <span>
                          {shippingAddress.shipping === s.express ? (
                            <div>
                              {s.currencySign}
                              {s.expressCharges}
                            </div>
                          ) : (
                            <span>
                              {s.standardCharges === "" ? (
                                "free"
                              ) : (
                                <span>
                                  {s.currencySign}
                                  {s.standardCharges}
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      </li>
                      <li>
                        <h4>Grandtotal</h4>
                        <span className="grand-total">
                          {s.currencySign}
                          {grandTotal}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lower-btn">
            <div className="btn-group">
              <button className="back" onClick={backHandler}>
                Back
              </button>
              <button className="next-step" onClick={placeOrderHandler}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default Confirmation;
