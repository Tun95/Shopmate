import axios from "axios";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { Context } from "../../../Context/Context";
import "./productList.css";
import { DeleteOutline } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import { toast } from "react-toastify";
import { getError } from "../../../components/Utilities/Utils";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { makeStyles } from "@material-ui/core";

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

// const useStyles = makeStyles(() => ({
//   ul: {
//     "& .MuiPaginationItem-root": {
//       color: "#fff",
//       backgroundColor: "#2e2e2e",
//     },
//   },
// }));

function ProductList() {
  // const classes = useStyles();
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

  const { state } = useContext(Context);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const navigate = useNavigate();

  //CREATE NEW PRODUCT
  const createHandler = async () => {
    if (window.confirm("Are you sure to create a new product?")) {
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
        navigate(`/admin/productedit/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
      }
    }
  };

  //DELETE PRODUCT
  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete this product?")) {
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
    }
  };

  return (
    <div>
      <div className="admin-product">
        <Helmet>
          <title>Products</title>
        </Helmet>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <div className="product-box">
            <div className="product-header">
              <h1>Product List</h1>
              <div className="create-btn">
                <button className="productAddButton" onClick={createHandler}>
                  Create
                </button>
              </div>
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
                      <li className="product-color">COLOR</li>
                      <li className="product-brand">BRAND</li>
                      <li className="product-size">SIZE</li>
                      <li className="product-actions">ACTIONS</li>
                    </ul>
                  </div>
                  <table className="product-table-column">
                    <tbody className="product-table-row">
                      {products.map((product, index) => (
                        <tr className="product-item-list" key={index}>
                          <td className="product-item-id">{product._id}</td>
                          <td className="product-item-name">{product.name}</td>
                          <td className="product-item-price">
                            £{product.price}
                          </td>
                          <td className="product-item-category">
                            {product.category.map((cat, index) => (
                              <span key={index}>{cat}</span>
                            ))}
                          </td>
                          <td className="product-item-color">
                            {product.color?.map((c) => (
                              <span key={c}>
                                <i className={c}></i>&nbsp;
                              </span>
                            ))}
                          </td>
                          <td className="product-item-brand">
                            {product.brand?.map((b) => (
                              <span key={b}>{b}</span>
                            ))}
                          </td>
                          <td className="product-item-size">
                            {product.size.map((s, index) => (
                              <span key={index}>{s}&nbsp;</span>
                            ))}
                          </td>
                          <td className="product-btn-view">
                            <button
                              className="product-btn"
                              onClick={() =>
                                navigate(`/admin/productedit/${product._id}`)
                              }
                            >
                              Edit
                            </button>
                            &nbsp;
                            <DeleteOutline
                              className="product-delete"
                              onClick={() => deleteHandler(product)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="product-pagination">
                {/* <div className="productlist-page"> */}
                {/* {[...Array(pages).keys()].map((x) => (
                    <Link
                      className={
                        x + 1 === Number(page) ? "btn text-bold" : "btn"
                      }
                      key={x + 1}
                      to={`/admin/products?page=${x + 1}`}
                    >
                      {x + 1}
                    </Link>
                  ))} */}
                <Pagination
                  page={page}
                  count={pages}
                  // classes={{ ul: classes.ul }}
                  color="secondary"
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/admin/products?page=${item.page}`}
                      {...item}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
