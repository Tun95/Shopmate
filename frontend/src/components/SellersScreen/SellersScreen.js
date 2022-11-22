import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./sellerscreen.css";
import Footer from "../Footer/Footer";
import Ratings from "../Ratings/Ratings";
import axios from "axios";
import { Context } from "../../Context/Context";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import { getError } from "../Utilities/Utils";
import person from "../images/person.png";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

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

function SellersScreen() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const params = useParams();

  const { id: sellerId } = params;

  const [
    { loading, error, products, user, topseller, loadingSeller, errorSeller },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingSeller: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/${sellerId}`);
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

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <>
          <div className="seller">
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
                    <div className="seller-details">
                      <div className="seller-name-img">
                        <img src={user.seller.logo || person} alt={user.seller.name} />
                        <h2>{user.seller.name}</h2>
                      </div>
                      <div className="ratings-rev">
                        <Ratings
                          rating={user.seller.rating}
                          // numReviews={user.seller.numReviews}
                        ></Ratings>
                        {user.seller.numReviews} Reviews
                      </div>
                      <div>
                        <h4>
                          <a href={`mailto:${user.email}`}>Contact Seller</a>
                        </h4>
                      </div>
                      <div>
                        <span>{user.seller.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <div className="box-2">
                    {products?.map((item, index) => (
                      <div key={index}>
                        <div className="product-list">
                          <div className="prod-design">
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
                                <Ratings
                                  rating={item.rating}
                                  numReviews={item.numReviews}
                                ></Ratings>
                              </div>
                              <div className="p-name">
                                <Link to={`/product/${item.slug}`}>
                                  <h4>{item.name}</h4>
                                </Link>
                                <div className="price">£{item.price}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
