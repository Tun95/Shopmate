import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useReducer } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { Context } from "../../../Context/Context";
import "./productList.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { toast } from "react-toastify";
import { getError } from "../../../components/Utilities/Utils";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import Footer from "../../../components/Footer/Footer";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };

    default:
      return state;
  }
};

function SellerProduct({ currencySign }) {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingDelete,
      successDelete,
      errorDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || 1);
  const seller = sp.get("seller") || userInfo._id || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/admin?page=${page}&seller=${seller}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
          // seller: sellerMode,
        });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete, seller]);

  // const getFilterUrl = (filter) => {
  //   const filterPage = filter.page || page;
  //   const filterSeller = filter.seller || seller;

  //   return `/products?page=${filterPage}&seller=${filterSeller}`;
  // };

  const navigate = useNavigate();

  //CREATE NEW PRODUCT
  const createHandler = async () => {
    try {
      const { data } = await axios.post(
        "/api/products",
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("product created successfully", {
        position: "bottom-center",
      });
      navigate(`/seller/productedit/${data.product._id}`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  //OPENING DELETE MODALS
  const [openDeleteModal, isOpenDeleteModal] = useState(false);
  const closeDeleteModal = () => {
    isOpenDeleteModal(false);
    document.body.style.overflow = "unset";
  };
  const showDeleteModal = (product) => {
    isOpenDeleteModal(true);
  };

  //DELETE PRODUCT

  const deleteHandler = async (product) => {
    try {
      await axios.delete(`/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("product deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  //OPENING CREATE MODALS
  const [openCreateModal, isOpenCreateModal] = useState(false);
  const closeCreateModal = () => {
    isOpenCreateModal(false);
    document.body.style.overflow = "unset";
  };
  const showCreateModal = () => {
    isOpenCreateModal(true);
  };
  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div>
          <div className="admin-product">
            <Helmet>
              <title>Products</title>
            </Helmet>

            <div className="product-box">
              <div className="product-header">
                <h1>Product List</h1>
                <div className="create-btn">
                  <button
                    className="productAddButton"
                    onClick={showCreateModal}
                  >
                    Create
                  </button>
                </div>
                {openCreateModal ? (
                  <div className="delete-modal">
                    <div className="delete-modal-box">
                      <div className="delete-modal-content">
                        <p className="delete-modal-content-p">
                          Are you sure to create a new product?
                        </p>
                        <div className="delete-modal-btn">
                          <button
                            onClick={closeCreateModal}
                            className="delete-modal-btn-close"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => {
                              createHandler();
                              closeCreateModal();
                            }}
                            className="delete-modal-btn-yes"
                          >
                            {" "}
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="product-section">
                <div className="product-table">
                  <div className="product-table-scroll">
                    <div className="product-table-header">
                      <ul>
                        <li className="product-id">ID</li>
                        <li className="product-name">NAME</li>
                        <li className="product-price">PRICE</li>
                        <li className="product-category">CATEGORY</li>

                        <li className="product-size">SIZE</li>
                        <li className="product-actions">ACTIONS</li>
                      </ul>
                    </div>
                    <table className="product-table-column">
                      <tbody className="product-table-row">
                        {products?.map((product, index) => (
                          <tr className="product-item-list" key={index}>
                            <tr>
                              <td className="product-item-id">{product._id}</td>
                              <td className="product-item-name">
                                {product.name}
                              </td>
                              <td className="product-item-price">
                                {currencySign}
                                {product.price}
                              </td>
                              <td className="product-item-category">
                                {product.category?.map((cat, index) => (
                                  <span key={index}>{cat}</span>
                                ))}
                              </td>

                              <td className="product-item-size">
                                {product.size?.map((s, index) => (
                                  <span key={index}>{s}&nbsp;</span>
                                ))}
                              </td>
                              <td className="product-btn-view">
                                <button
                                  className="product-btn"
                                  onClick={() =>
                                    navigate(
                                      `/seller/productedit/${product._id}`
                                    )
                                  }
                                >
                                  Edit
                                </button>
                                &nbsp;
                                <DeleteOutlineIcon
                                  className="product-delete"
                                  onClick={() => deleteHandler(product)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <tr>
                                {/* {openDeleteModal ? (
                                  <div className="delete-modal">
                                    <div className="delete-modal-box">
                                      <div className="delete-modal-content">
                                        <p className="delete-modal-content-p">
                                          Are you sure to delete this product?
                                        </p>
                                        <div className="delete-modal-btn">
                                          <button
                                            onClick={closeDeleteModal}
                                            className="delete-modal-btn-close"
                                          >
                                            Close
                                          </button>
                                          <button
                                            onClick={() => {
                                              deleteHandler(product);
                                              closeDeleteModal();
                                            }}
                                            className="delete-modal-btn-yes"
                                          >
                                            {" "}
                                            Yes
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )} */}
                              </tr>
                            </tr>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="product-pagination">
                  <Pagination
                    page={page}
                    count={pages}
                    color="secondary"
                    renderItem={(item) => (
                      <PaginationItem
                        className={`${
                          item.page !== page
                            ? "paginationItemStyle"
                            : "paginationItemStyle active"
                        }`}
                        component={Link}
                        to={`/seller/products?page=${item.page}`}
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

export default SellerProduct;
