import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";
import Footer from "../Footer/Footer";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import { getError } from "../Utilities/Utils";
import "./OrderScreen.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, errorDeliver: false };
    default:
      return state;
  }
};

function OrderScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Context);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order, loadingDeliver, successDeliver }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/signin");
    }
    // if (!order._id || successDeliver || (order._id && order._id !== orderId)) {
    if (successDeliver) {
      dispatch({ type: "DELIVER_RESET" });
    }
    fetchOrder();
  }, [navigate, orderId, successDeliver, userInfo]);

  //ORDER APPROVE
  async function deliverOrderHandler() {
    try {
      // dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  //PAY FOR ORDER
  const payNowHandler = () => {
    navigate(`/payment/${orderId}`);
  };

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="order-screen">
            <div className="o-screen">
              <Helmet>
                <title>Order {orderId}</title>
              </Helmet>
              <h1 className="order-header"> Order {orderId}</h1>
              <div className="list-box">
                <div className="order-sec">
                  <div className="order-details">
                    <div className="top-split">
                      <div className="top-box">
                        <h2>Shipping</h2>
                        <div className="order-a-ship">
                          <div className="order-top">
                            <label htmlFor="">
                              <strong>Name: </strong>
                            </label>
                            {order.shippingAddress.firstName}{" "}
                            {order.shippingAddress.lastName} <br />
                            <label htmlFor="">
                              <strong>Address: </strong>
                            </label>
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.cState},{" "}
                            {order.shippingAddress.zipCode},{" "}
                            {order.shippingAddress.country} <br />
                            <label htmlFor="">
                              <strong>Shipping Method: </strong>
                            </label>
                            {order.shippingAddress.shipping}
                          </div>
                          <div className="place-deliver">
                            <div className="ind-deliver">
                              {order.isDelivered ? (
                                <div className="suc">
                                  <MessageBox variant="success">
                                    {" "}
                                    Delivered at {order.deliveredAt}
                                  </MessageBox>
                                </div>
                              ) : (
                                <MessageBox variant="danger">
                                  Not Delivered
                                </MessageBox>
                              )}
                            </div>
                            {userInfo.isAdmin &&
                            order.isPaid &&
                            !order.isDelivered ? (
                              <div className="admin-approve">
                                <div className="admin-approve-btn">
                                  <button
                                    type="button"
                                    onClick={deliverOrderHandler}
                                  >
                                    Deliver Order
                                  </button>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <table className="order-table-data">
                        <thead>
                          <tr>
                            <td className="t-header" colSpan="2" align="center">
                              <h2> Order Summary</h2>
                            </td>
                          </tr>
                        </thead>
                        <tbody cellPadding="3">
                          <tr>
                            <td className="items-p">Items Price</td>
                            <td className="items-d">
                              £{order.itemsPrice.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-p">Shipping Price</td>
                            <td className="items-d">
                              £{order.shippingPrice.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-p">Tax Price</td>
                            <td className="items-d">
                              £{order.taxPrice.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong className="items-p grand">
                                Grand Total
                              </strong>
                            </td>
                            <td className="items-d grand">
                              <strong>£{order.grandTotal.toFixed(2)}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="sec-box">
                      <h2>Payment</h2>
                      <div className="sec-box-body">
                        <div className="p-method">
                          <strong>Status: </strong>
                        </div>
                        <div>
                          {userInfo._id && order.isPaid ? (
                            <MessageBox variant="success">
                              Paid at {order.paidAt}
                            </MessageBox>
                          ) : (
                            <div className="not-paid-btn">
                              <MessageBox variant="danger">Not Paid</MessageBox>
                              <button
                                className="sec-pay-now"
                                onClick={payNowHandler}
                              >
                                Pay Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="order-items">
                      <h2>Items</h2>
                      <div className="items-box">
                        <div className="items-box">
                          <div className="box-list">
                            {order.orderItems.map((item, index) => (
                              <div className="table-order" key={index}>
                                <div className="order-first-row">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="order-small"
                                  />
                                  <div className="order-name-gen">
                                    <Link to={`/product/${item.slug}`}>
                                      <h3>{item.name}</h3>
                                    </Link>
                                    <div className="gen">
                                      {item.keygen}
                                      {/* CHECK */}{" "}
                                      <i className={item.color}></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="order-second-row">
                                  <div className="order-clothe-size">
                                    {item.size}
                                  </div>
                                </div>
                                <div className="order-third-row">
                                  <div className="order-quantity">
                                    <span>{item.quantity}</span>
                                  </div>
                                </div>
                                <div className="order-forth-row">
                                  <div className="order-cart-price">
                                    {item.discount ? (
                                      <div className="cart-price">
                                        £
                                        {(
                                          item.price -
                                          (item.price * item.discount) / 100
                                        ).toFixed(0) * item.quantity}
                                      </div>
                                    ) : (
                                      <div className="cart-price">
                                        £{item.price.toFixed(0) * item.quantity}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default OrderScreen;
