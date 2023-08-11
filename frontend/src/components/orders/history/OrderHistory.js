import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";

import "./styles.css";
import axios from "axios";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Context } from "../../../Context/Context";
import { getError } from "../../Utilities/util/Utils";
import LoadingBox from "../../Utilities/message loading/LoadingBox";
import MessageBox from "../../Utilities/message loading/MessageBox";
import Footer from "../../../common/footer/Footer";
import { request } from "../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistory({ currencySign }) {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, orders, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${request}/api/orders/mine?page=${page}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    fetchData();
  }, [userInfo, navigate, page]);

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <>
          <div className="order">
            <Helmet>
              <title>Order History</title>
            </Helmet>

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
                      {orders.map((order) => (
                        <ul className="order-item-list" key={order._id}>
                          <li className="item-id">{order._id}</li>
                          <li className="created">
                            {order.createdAt.substring(0, 10)}
                          </li>
                          <li className="total-paid">
                            {currencySign}
                            {order.grandTotal.toFixed(2)}
                          </li>
                          <li className="paid">
                            {order.paymentMethod === "Cash on Delivery" ? (
                              <span className="with_cash">With Cash</span>
                            ) : order.paymentMethod !== "Cash on Delivery" &&
                              order.isPaid ? (
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
                <div className="product-pagination seller_pagination">
                  <Pagination
                    page={page}
                    count={pages}
                    renderItem={(item) => (
                      <PaginationItem
                        className={`${
                          item.page !== page
                            ? "paginationItemStyle"
                            : "paginationItemStyle active"
                        }`}
                        component={Link}
                        to={`/orderhistory?page=${item.page}`}
                        {...item}
                      />
                    )}
                  />
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

export default OrderHistory;
