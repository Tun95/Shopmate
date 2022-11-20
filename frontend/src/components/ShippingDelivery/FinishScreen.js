import React, { useContext, useEffect, useReducer } from "react";
import CheckoutSteps from "./CheckoutSteps";
import "./FinishScreen.css";
import finish from "../images/finish.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";

function FinishScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Context);
  const {
    cart: { cartItems, shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping?redirect");
    }
  }, [shippingAddress, navigate]);
  const handleBack = () => {
    navigate("/store");
  };
  return (
    <div className="finish">
      <div className="finish-box">
        <h2>Checkout</h2>
        <div className="checkout">
          <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        </div>
        <div className="finish-sections">
          <div className="f-sections">
            <div className="img">
              <img src={finish} alt="" />
            </div>
            <div className="details">
              <h1>Success!</h1>
              <span>
                Your items will be shipped shortly, <br /> you will get email
                with details.
              </span>
            </div>
            <div className="finish-btn">
              <button onClick={handleBack}>Back to Shop</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinishScreen;
