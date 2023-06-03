import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./orderList.css";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import Footer from "../../../../common/footer/Footer";
import LoadingBox from "../../../../components/Utilities/message loading/LoadingBox";
import MessageBox from "../../../../components/Utilities/message loading/MessageBox";
import { Context } from "../../../../Context/Context";
import { getError } from "../../../../components/Utilities/util/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function SellerOrders({ currencySign }) {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [
    { loading, error, orders, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { search } = useLocation();
  // const { pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || 1);
  const seller = sp.get("seller") || userInfo._id || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/orders/admin?page=${page}&seller=${seller}`,
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, seller, successDelete, userInfo]);

  //DELETE
  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete this product?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Order deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };
  console.log(orders);
  return (
    <>
      {" "}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="admin-order">
            <Helmet>
              <title>Orders</title>
            </Helmet>

            <div className="admin-order-box">
              <h1 className="order-admin-header">Orders</h1>

              <div className="admin-order-section">
                <div className="admin-order-table">
                  <div className="admin-order-table-header">
                    <ul>
                      <li className="admin-order-item">ID</li>
                      <li className="admin-order-user">USER</li>
                      <li className="admin-order-date">DATE</li>
                      <li className="admin-order-total">TOTAL</li>
                      <li className="admin-order-paid">PAID</li>
                      <li className="admin-order-deliv">DELIVERED</li>
                      <li className="admin-order-actions">ACTIONS</li>
                    </ul>
                  </div>

                  <div className="admin-order-table-body">
                    <div className="admin-order-table-row">
                      {orders?.map((order) => (
                        <ul className="admin-order-item-list" key={order._id}>
                          <li className="admin-item-id">{order._id}</li>
                          <li className="admin-user-name">
                            {order.user ? order.user.name : "DELETED USER"}
                          </li>
                          <li className="admin-created">
                            {order.createdAt.substring(0, 10)}
                          </li>
                          <li className="admin-total-paid">
                            {currencySign}
                            {order.grandTotal.toFixed(2)}
                          </li>
                          <li className="admin-paid">
                            {order.paymentMethod === "Cash on Delivery" ? (
                              <span className="with_cash">With Cash</span>
                            ) : order.paymentMethod !== "Cash on Delivery" &&
                              order.isPaid ? (
                              <div className="admin-paidAt">
                                {order.paidAt.substring(0, 10)}
                              </div>
                            ) : (
                              <div className="admin-negate">No</div>
                            )}
                          </li>
                          <li className="admin-deliver">
                            {order.isDelivered ? (
                              <div className="admin-paidAt">
                                {order.deliveredAt.substring(0, 10)}
                              </div>
                            ) : (
                              <div className="admin-negate">No</div>
                            )}
                          </li>
                          <li className="admin-order-btn-view">
                            <button
                              className="admin-order-btn"
                              onClick={() => {
                                navigate(`/order/${order._id}`);
                              }}
                            >
                              Details
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              className="admin-order-delete"
                              onClick={() => deleteHandler(order)}
                            >
                              Delete
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
                        to={`/seller/orderlist?page=${item.page}`}
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
        </div>
      )}
    </>
  );
}

export default SellerOrders;
