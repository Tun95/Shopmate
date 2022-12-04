import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "./CheckoutSteps";
import StripeCheckout from "react-stripe-checkout";
import "./Payment.css";
import paypal from "../images/paypal.png";
import stripe from "../images/stripe.png";
import vismas from "../images/vismas.png";
import { Context } from "../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import LoadingBox from "../Utilities/LoadingBox";
import Footer from "../Footer/Footer";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, errorPay: action.payload };

    default:
      return state;
  }
};
function Payment(props) {
  const navigate = useNavigate();

  //ORDER POSTING
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  //PAYMENT METHOD
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  //STRIPE MODAL
  const [openStripeModal, is0penStripeModal] = useState(false);
  const closeStripeModal = () => {
    is0penStripeModal(false);
    document.body.style.overflow = "unset";
  };
  const showStripeModal = () => {
    is0penStripeModal(true);
  };
  const backHandler = () => {
    navigate("/confirmation?redirect");
  };

  const StripeModal = () => {
    closePaypalModal();
    showStripeModal();
  };

  //PAYPAL MODAL
  const [openPaypalModal, is0penPaypalModal] = useState(false);
  const closePaypalModal = () => {
    is0penPaypalModal(false);
    document.body.style.overflow = "unset";
  };
  const showPaypalModal = () => {
    is0penPaypalModal(true);
  };

  //PAYPAL BUTTONS ACTIONS
  const params = useParams();
  const { id: orderId } = params;
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // const [sdkReady, setSdkReady] = useState(false);

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       dispatch({ type: "FETCH_REQUEST" });
  //       const { data } = await axios.get(`/api/orders/${orderId}`, {
  //         headers: { authorization: `Bearer ${userInfo.token}` },
  //       });
  //       dispatch({ type: "FETCH_SUCCESS", payload: data });
  //     } catch (err) {
  //       dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  //     }
  //   };
  //   if (!userInfo) {
  //     return navigate("/login");
  //   }
  //   if (!order._id || successPay || (order._id && order._id !== orderId)) {
  //     fetchOrder();
  //     if (successPay) {
  //       dispatch({ type: "PAY_RESET" });
  //     }
  //   } else {
  //     const loadPaypalScript = async () => {
  //       const { data: clientId } = await axios.get("/api/keys/paypal", {
  //         headers: { authorization: `Bearer ${userInfo.token}` },
  //       });
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": clientId,
  //           currency: "GBP",
  //         },
  //       });
  //       paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  //     };

  //     loadPaypalScript();
  //   }
  // }, []);
  useEffect(() => {
    if (!userInfo) {
      return navigate("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [navigate, order._id, orderId, paypalDispatch, successPay, userInfo]);

  function createOrder(data, action) {
    return action.order
      .create({
        purchase_units: [{ amount: { value: order.grandTotal } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: "PAY_SUCCESS", payload: data });

        toast.success("Order is paid", { position: "bottom-center" });
        if (!order.isPaid) {
          // ctxDispatch({ type: "CART_CLEAR" });
          // localStorage.removeItem("cartItems");
          navigate("/finish");
        }
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err), { position: "bottom-center" });
      }
    });
  }
  function onError(err) {
    toast.error(getError(err), { position: "bottom-center" });
  }

  //ERROR CHECK

  const PaypalOrderModal = () => {
    showPaypalModal();
    closeStripeModal();
  };

  //Navigation
  useEffect(() => {
    if (order.isPaid) {
      navigate("/finish?redirect");
    }
  }, [navigate, cartItems, order.isPaid]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
  };

  //STRIPE SECTION
  // const KEY = process.env.REACT_APP_STRIPE;

  const [stripeToken, setStripeToken] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };
  console.log(stripeToken);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post("/api/checkout/payment", {
          tokenId: stripeToken.id,
          amount: order.grandTotal * 100,
        });
        if (order.isPaid) {
          navigate("/finish?redirect");
        }
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    stripeToken && makeRequest();
  }, [navigate, order, stripeToken]);

  return (
    <>
      <div className="payment">
        <Helmet>
          <title>Payment</title>
        </Helmet>
        <div className="payment-box">
          <div className="header-check">
            <div className="c-check">
              <h2 className="box-check n-t-y">Checkout</h2>
              <h3 className="box-check-title ">Payment Methods</h3>
              <div className="checkout">
                <CheckoutSteps step1 step2 step3></CheckoutSteps>
              </div>
            </div>
          </div>
          <form action="" onSubmit={submitHandler}>
            <div className="payment-details">
              <div className="payment-section">
                <label
                  className={openStripeModal ? "active" : "stripe"}
                  htmlFor="stripe"
                  onClick={StripeModal}
                >
                  <div className="stripe-svg">
                    <div className="svg">
                      <img src={stripe} alt="" />
                      <div className="masvis">
                        <img src={vismas} alt="" />
                      </div>
                    </div>

                    <input
                      type="radio"
                      required
                      name="payment"
                      id="stripe"
                      value="Stripe"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>
                      <strong>
                        {" "}
                        Pay £{order.grandTotal?.toFixed(0)} with credit card
                      </strong>
                    </span>
                  </div>
                </label>

                <label
                  className={openPaypalModal ? "active-paypal" : "paypal"}
                  id="paypal"
                  onClick={PaypalOrderModal}
                >
                  <div className="paypal-svg">
                    <div className="svg">
                      <img src={paypal} alt="" />
                    </div>

                    <input
                      type="radio"
                      required
                      name="payment"
                      id="paypal"
                      value="PayPal"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>
                      <strong>
                        {" "}
                        Pay £{order.grandTotal?.toFixed(0)} with PayPal
                      </strong>
                    </span>
                  </div>
                </label>
              </div>

              <div className="paypal-stripe">
                {!order.isPaid && (
                  <div>
                    {openStripeModal && (
                      <div className="stripe-details">
                        <div className="p-inner-form">
                          <div className="form-group">
                            <label htmlFor="card-holder">
                              Cardholder's Name
                            </label>
                            <div className="payment-input-box">
                              <input
                                disabled
                                type="text"
                                id="name"
                                placeholder="Name"
                              />
                              <i className="fa fa-user"></i>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="card-number">Card Number</label>
                            <div className="payment-input-box">
                              <input
                                type="tel"
                                disabled
                                id="card-number"
                                name="card-number"
                                inputMode="numeric"
                                pattern="[\d ]{10,30}"
                                maxLength="16"
                                placeholder="**** **** **** ****"
                              />
                              <i className="fa fa-credit-card"></i>
                            </div>
                          </div>
                          <div className="form-date">
                            <div className="form-group-d">
                              <label htmlFor="card-date">Valid thru.</label>
                              <div className="cvc-fa-icon">
                                <input
                                  disabled
                                  type="text"
                                  placeholder="MM/YY"
                                />
                              </div>
                            </div>
                            <div className="form-group-d">
                              <label htmlFor="card-cvv">CVV / CVC*</label>
                              <div className="cvc-fa-icon">
                                <input
                                  type="tel"
                                  disabled
                                  id="cvv"
                                  maxLength="3"
                                  pattern="[0-9]{3}"
                                  placeholder="cvv"
                                />
                                <i className="fa fa-lock" id="passcvv"></i>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <span>
                              * CVV or CVC is the card security code, unique
                              three digits number on the back of your card
                              separate from its number
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {openPaypalModal && (
                      <div className="paypal-details">
                        {/* {!order.isPaid && ( */}
                        <div className="paypal-btn">
                          {/* {isPending && ( */}
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                          {/* )} */}
                        </div>
                        {/* )} */}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-lower-btn">
                <div className="btn-group">
                  <button className="back" onClick={backHandler}>
                    Back
                  </button>
                  {/* {openPaypalModal && (
                  <button className="pay" disabled>
                    Pay
                  </button>
                )}
                {openStripeModal && (
                  <StripeCheckout
                    name="SHOPMATE"
                    image=""
                    billingAddress
                    shippingAddress
                    description={`Your total is $${order.grandTotal}`}
                    amount={order.grandTotal * 100}
                    token={onToken}
                    stripeKey={KEY}
                  >
                    <button type="submit" className="next-step">
                      Pay
                    </button>
                  </StripeCheckout>
                )} */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default Payment;
