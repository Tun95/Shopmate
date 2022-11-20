import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";
import { getError } from "../Utilities/Utils";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmationScreen.css";

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

function ConfirmationScreen() {
  const navigate = useNavigate();
  const {
    state,
    dispatch: ctxDispatch,
    Express,
    Standard,
  } = useContext(Context);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = shippingAddress.shipping === Express ? 28 : 0;
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

  // const nextStep = () => {
  //   navigate(`/payment/${order._id}`);
  // };

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const placeOrderHandler = async () => {
    dispatch({ type: "CREATE_REQUEST" });
    try {
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          // paymentMethod,
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
  };

  return (
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
                          <span className="price">
                            £{item.price.toFixed(0) * item.quantity}
                          </span>
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
            <div className="con-3">
              <div>
                <button disabled>TAXPRICE 14%</button>
              </div>
              <div className="list-shipping">
                <ul>
                  <li className="drag">
                    <h4>Subtotal</h4>
                    <span>£{itemsPrice.toFixed(0)}</span>
                  </li>
                  <li className="drag">
                    <h4>Shipping</h4>{" "}
                    <span>
                      {shippingAddress.shipping === Express ? (
                        <div>£28</div>
                      ) : (
                        "free"
                      )}
                    </span>
                  </li>
                  <li>
                    <h4>Grandtotal</h4>
                    <span className="grand-total">£{grandTotal}</span>
                  </li>
                </ul>
              </div>
            </div>
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
  );
}

export default ConfirmationScreen;
