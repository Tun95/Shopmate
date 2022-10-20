import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import "./OrderHistory.css";
import axios from "axios";
import { getError } from "../Utilities/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistory() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/orders/mine", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    fetchData();
  }, [userInfo, navigate]);

  return (
    <div className="order">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div className="order-box">
          <h1 className="order-box-header">Order History</h1>

          <div className="order-section">
            <div className="order-table">
              <div className="order-table-header">
                <ul>
                  <li className="order-item">ID</li>
                  <li className="order-date">DATE</li>
                  <li className="order-total">TOTAL</li>
                  <li className="order-paid">PAID</li>
                  <li className="order-deliv">DELIVERED</li>
                  <li className="order-actions">ACTIONS</li>
                </ul>
              </div>

              <div className="order-table-body">
                <div className="order-table-row">
                  {orders.reverse().map((order) => (
                    <ul className="order-item-list" key={order._id}>
                      <li className="item-id">{order._id}</li>
                      <li className="created">
                        {order.createdAt.substring(0, 10)}
                      </li>
                      <li className="total-paid">
                        £{order.grandTotal.toFixed(2)}
                      </li>
                      <li className="paid">
                        {order.isPaid ? (
                          <div className="paidAt">
                            {order.paidAt.substring(0, 10)}
                          </div>
                        ) : (
                          <div className="negate">No</div>
                        )}
                      </li>
                      <li className="deliver">
                        {order.isDelivered ? (
                          <div className="paidAt">
                            {order.deliveredAt.substring(0, 10)}
                          </div>
                        ) : (
                          <div className="negate">No</div>
                        )}
                      </li>
                      <li className="order-btn-view">
                        <button
                          className="order-btn"
                          onClick={() => {
                            navigate(`/order/${order._id}`);
                          }}
                        >
                          Details
                        </button>
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
