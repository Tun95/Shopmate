import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./sellerscreen.scss";
import Footer from "../Footer/Footer";
import Ratings from "../Ratings/Ratings";
import axios from "axios";
import { Context } from "../../Context/Context";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import { getError } from "../Utilities/Utils";
import person from "../images/person.png";
import dateFormat, { masks } from "dateformat";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Pagination, PaginationItem } from "@mui/material";
import { Helmet } from "react-helmet-async";

masks.longDate = 'mmmm d, yyyy! "Can\'t touch this!"';

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

    case "FETCH_SELLER_REQUEST":
      return { ...state, loadingSeller: true };
    case "FETCH_SELLER_SUCCESS":
      return { ...state, loadingSeller: false, user: action.payload };
    case "FETCH_SELLER_FAIL":
      return { ...state, loadingSeller: false, errorSeller: action.payload };

    case "FETCH_TOP_SELLER_REQUEST":
      return { ...state, loadingSeller: true };
    case "FETCH_TOP_SELLER_SUCCESS":
      return { ...state, loadingSeller: false, topseller: action.payload };
    case "FETCH_TOP_SELLER_FAIL":
      return { ...state, loadingSeller: false, errorSeller: action.payload };

    default:
      return state;
  }
};

function SellersScreen({ currencySign }) {
  const now = new Date();

  const { state } = useContext(Context);
  const { userInfo } = state;
  const params = useParams();

  const { id: sellerId } = params;

  const [
    {
      loading,
      error,
      products,
      user,
      pages,
      topseller,
      loadingSeller,
      errorSeller,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingSeller: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/seller/${sellerId}`);
        dispatch({ type: "FETCH_SELLER_SUCCESS", payload: data });
        console.log(data);
      } catch (err) {
        dispatch({ type: "FETCH_SELLER_FAIL", payload: getError(err) });
      }
    };

    fetchData();
    console.log(user);
  }, []);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || 1);
  const seller = sp.get("seller") || sellerId || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/admin?page=${page}&seller=${seller}`
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    fetchData();
  }, [page, userInfo, seller]);

  //TOP SELLERS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/top-sellers`);
        dispatch({
          type: "FETCH_TOP_SELLER_SUCCESS",
          payload: data,
        });
      } catch (err) {
        dispatch({ type: "FETCH_TOP_SELLER_FAIL" });
      }
    };

    fetchData();
  }, [page, userInfo, seller]);

  console.log(user);

  dateFormat(now, `mmmm d, yyyy`);

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <>
          <div className="seller">
            <Helmet>
              <title>Seller's Page</title>
            </Helmet>
            <div className="seller-contanainer">
              {/* <Carousel
                showArrows
                //autoPlay
                showThumbs={false}
                className="carousel"
              >
                {topseller.map((item, index) => (
                  <div key={index} className="carousel-items">
                    <div className="carousel-details">
                      <h3 >{item.seller.name}</h3>
                      <p>{item.seller.description}</p>
                      <Link to={`/sellers-screen/${item._id}`}>
                        <button>View Products</button>
                      </Link>
                    </div>
                    <img src={item.seller.logo} alt="" />
                  </div>
                ))}
              </Carousel> */}
              <div className="seller-box">
                <div className="box">
                  <div className="box-1">
                    <div className="seller_details">
                      <div className="seller_img">
                        <img
                          src={user?.user?.seller?.logo || person}
                          alt={user?.user?.seller?.name}
                        />
                      </div>
                      <span>
                        <div className="seller_name">
                          <h3>Seller:</h3>
                          <h4>{user?.user?.seller?.name}</h4>
                        </div>
                        <div className="seller_member_country">
                          <span>{user?.user?.country}, </span>
                          <p>
                            Member since
                            <small className="membership">
                              {dateFormat(user?.user?.createdAt)}
                            </small>
                          </p>
                        </div>
                        <div className="ratings-rev">
                          {/* <Ratings rating={user?.seller?.rating}></Ratings> */}
                          {/* <span
                            style={{ fontWeight: "bold", margin: "0px 5px" }}
                          >
                            {" "}
                            ({user?.numReviews[0]?.numReviews})
                          </span>{" "}
                          Reviews */}
                        </div>
                        <div>
                          <h4>
                            <a href={`mailto:${user?.user?.email}`}>
                              Contact Seller
                            </a>
                          </h4>
                        </div>
                        <div className="account_status">
                          <label>Status:</label>
                          {!user?.user?.isAccountVerified ? (
                            <span className="unverified-account">
                              unverified seller
                            </span>
                          ) : (
                            <span className="verified-account">
                              verified seller
                            </span>
                          )}
                        </div>
                      </span>
                    </div>
                    <div className="seller_bio">
                      <h3>Bio:</h3>
                      <span>{user?.user?.seller?.description}</span>
                    </div>
                  </div>
                </div>
                <div className="list_header">
                  <h2>Product List</h2>
                </div>
                <div className="box">
                  <div className="box-2">
                    {products?.map((item, index) => (
                      <div key={index}>
                        <div className="product_list">
                          <div className="prod_design">
                            <div className="top-list-product">
                              <Link to={`/product/${item.slug}`}>
                                {" "}
                                <img
                                  src={item.image}
                                  className="product-img"
                                  alt={item.name}
                                />
                              </Link>
                              <div className="seller-prod-rev">
                                <span>
                                  <strong>({item.numReviews})</strong> Reviews
                                </span>
                                <Ratings rating={item.rating}></Ratings>
                              </div>
                              <div className="p-name">
                                <Link to={`/product/${item.slug}`}>
                                  <h4>{item.name}</h4>
                                </Link>
                                <div className="price">
                                  {item.discount > 0 ? (
                                    <>
                                      <div>
                                        <div className="price">
                                          {currencySign}
                                          {(
                                            item.price -
                                            (item.price * item.discount) / 100
                                          )?.toFixed(2)}
                                        </div>
                                        <s className="discount">
                                          {currencySign}
                                          {item.price?.toFixed(2)}
                                        </s>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="price">
                                      {currencySign}
                                      {item.price?.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="product_pagination">
                    <span className="pagination_span">
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
                            to={`/sellers-screen/${sellerId}?page=${item.page}`}
                            {...item}
                          />
                        )}
                      />
                    </span>
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

export default SellersScreen;
