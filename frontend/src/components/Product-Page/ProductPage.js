import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import { Link, useParams } from "react-router-dom";
import "../Product-Page/ProductPage.scss";
import Rating from "@mui/material/Rating";

import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

import { Helmet } from "react-helmet-async";
import Ratings from "../Ratings/Ratings";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import axios from "axios";
import { getError } from "../Utilities/Utils";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";
import Slider from "react-slick";
import parse from "html-react-parser";
import ReactTimeAgo from "react-time-ago";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };

    case "ADD_REQUEST":
      return { ...state, loadingAddReview: true };
    case "ADD_SUCCESS":
      return { ...state, loadingAddReview: false };
    case "ADD_FAIL":
      return { ...state, loadingAddReview: false };

    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };

    case "FETCH_SIM_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SIM_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_SIM_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i className="fa-solid fa-angle-left"></i>
      </button>
    </div>
  );
};

function ProductPage(props) {
  //SLIDER SETTINGS
  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 880,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 665,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 414,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  const smallSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };

  //Image Selection
  const [selectedImage, setSelectedImage] = useState("");

  //Color Style
  const [color, setColor] = useState(false);

  //Size state
  const [size, setSize] = useState(false);

  //Product Quantity
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const params = useParams();
  const { slug } = params;

  const [{ loading, error, products, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      products: [],
      product: [],
      loading: true,
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        window.scrollTo(0, 0);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);

  //FETCH RELATED PRODUCTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/products/related/${product._id}`);
        dispatch({ type: "FETCH_SIM_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_SIM_FAIL", payload: error.message });
      }
    };

    fetchData();
  }, [product._id]);
  console.log(products);

  //ADD TO CART
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {
    cart: { cartItems },
    userInfo,
    settings,
  } = state;
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);

    // if (cartItems.length > 0 && data.seller._id !== cartItems[0].seller._id) {
    //   dispatch({
    //     type: "CART_ADD_ITEM_FAIL",
    //     payload: `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
    //   });
    //   toast.error(
    //     `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
    //     {
    //       position: "bottom-center",
    //     }
    //   );
    // } else {
    if (data.countInStock < quantity) {
      toast.error("Sorry, Product stock limit reached or out of stock", {
        position: "bottom-center",
      });
      return;
    } else {
      toast.success(`${product.name} is successfully added to cart`, {
        position: "bottom-center",
      });
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...product,
        seller: data.seller,
        quantity,
        size,
        color,
      },
    });
    localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems));
    // }
  };
  console.log(product);

  //PRODUCT REVIEWS
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitHandler = async (e, values, actions) => {
    setTimeout(() => {
      actions.resetForm();
    }, 1000);
    e.preventDefault();
    if (!comment && !rating) {
      toast.error("Please enter comment and select rating of your choice", {
        position: "bottom-center",
      });
      return;
    } else {
      if (comment.length < 50) {
        toast.error("Your review must be at least 50 characters", {
          position: "bottom-center",
        });
      } else {
        try {
          const { data } = await axios.post(
            `/api/products/${product._id}/reviews`,
            { rating, comment, name: userInfo.name },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );

          dispatch({
            type: "CREATE_SUCCESS",
            payload: { seller: data.seller },
          });
          toast.success("Review submitted successfully", {
            position: "bottom-center",
          });

          product.reviews.unshift(data.review);
          product.numReviews = data.numReviews;
          product.rating = data.rating;
          dispatch({ type: "REFRESH_PRODUCT", payload: product });

          window.scrollTo({
            behavior: "smooth",
            top: reviewsRef.current.offsetTop,
          });
        } catch (err) {
          toast.error(getError(err), { position: "bottom-center" });
          dispatch({ type: "CREATE_FAIL" });
          console.log(err);
        }
      }
    }
  };

  //Wish List

  const [checked, setChecked] = useState(false);
  const handleChange = async (event) => {
    try {
      const { data } = await axios.post(
        `/api/wishes`,
        {
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          discount: product.discount,
          product: product._id,
          checked: true,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "ADD_SUCCESS",
        payload: { seller: data.seller },
      });
      toast.success("Added to wish list successfully", {
        position: "bottom-center",
      });

      dispatch({ type: "REFRESH_PRODUCT", payload: product });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "ADD_FAIL" });
      console.log(err);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className=" product_details">
            <div className="sections-blocks">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <div className="sections_blocks">
                <div className="sections front_container">
                  <div className="section-1">
                    <div className="left_side">
                      <div className="img">
                        <div className="img-large">
                          <img src={selectedImage || product.image} alt="" />
                        </div>
                        <div className="img-small-l">
                          <div className="image-selected-preview-prod">
                            <Slider {...smallSettings} className="">
                              {[product.image, ...product.images].map((x) => (
                                <div className="small_img_slide">
                                  <span
                                    key={x}
                                    onClick={() => setSelectedImage(x)}
                                    className={`${
                                      x === selectedImage
                                        ? "selected_image"
                                        : ""
                                    }`}
                                  >
                                    <img src={x} alt="" />
                                  </span>
                                </div>
                              ))}
                            </Slider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right_side">
                      <div className="top_list">
                        <ul>
                          <li>
                            <Link to="/">Home </Link>
                          </li>
                          <li>
                            <Link to="/store">All Categories</Link>
                          </li>
                          <li>
                            <Link
                              to="/store?category=Men"
                              className="last-child"
                            >
                              Men's Clothing &amp; Accessories{" "}
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="prod-rating">
                        <Ratings rating={product.rating}></Ratings>
                        <div className="count_in_stock">
                          {product.countInStock === 0 ? (
                            <span className="danger">Unavailable</span>
                          ) : (
                            <span className="success">In Stock</span>
                          )}
                        </div>
                      </div>

                      <div className="prod-title">
                        <h2>{product?.name}</h2>
                      </div>
                      <span>
                        {product.seller ? (
                          <div className="seller_name_link">
                            <h4>Seller: </h4>
                            <Link to={`/sellers-screen/${product.seller._id}`}>
                              {product.seller.seller.name}
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </span>
                      <span className="product_price">
                        {product.discount > 0 ? (
                          <>
                            {settings?.map((s, index) => (
                              <div className="price_discount" key={index}>
                                <div className="price">
                                  {s.currencySign}
                                  {(
                                    product.price -
                                    (product.price * product.discount) / 100
                                  )?.toFixed(2)}
                                </div>
                                <s className="discount">
                                  {s.currencySign}
                                  {product.price?.toFixed(2)}
                                </s>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {settings?.map((s, index) => (
                              <div className="price" key={index}>
                                {s.currencySign}
                                {product.price?.toFixed(2)}
                              </div>
                            ))}
                          </>
                        )}
                      </span>

                      <div className="product-color">
                        <h4>Color</h4>
                        <ul>
                          {product.color?.map((c, index) => (
                            <li
                              key={index}
                              onClick={() => setColor(c)}
                              className={`${color === c ? "active" : ""}`}
                            >
                              <img
                                src={c}
                                alt={c}
                                className="color_image_size"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="product_size">
                        <div className="size-header">
                          <h4>Size</h4>
                          <h3>
                            <Link to="/size-guidelines">Size guide</Link>
                          </h3>
                        </div>

                        <div className="product-size-btn">
                          {product.size?.map((s, index) => (
                            <button
                              key={index}
                              onClick={() => setSize(s)}
                              className={`${size === s ? "size" : ""}`}
                            >
                              {s}&nbsp;
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="product_quantity">
                        <h4>Quantity</h4>
                        <div className="product_quantity_content">
                          <button
                            disabled={quantity === 1}
                            onClick={() => handleQuantity("dec")}
                            className="remove-from"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <div className="quantity">
                            <span>{quantity}</span>
                          </div>
                          <button
                            disabled={product.countInStock === 0}
                            onClick={() => handleQuantity("inc")}
                            className="add-to"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>

                      <div className="product_wish_btn">
                        <div className="button">
                          {product.countInStock === 0 ? (
                            <button disabled className="out-o-stock">
                              Out of Stock
                            </button>
                          ) : (
                            <button
                              className="add-to-cart"
                              onClick={addToCartHandler}
                            >
                              Add to cart
                            </button>
                          )}
                        </div>
                        <div className="wish-list">
                          <Checkbox
                            checked={checked}
                            onChange={handleChange}
                            className="mui-favorite-checkbox"
                            icon={<FavoriteBorder />}
                            checkedIcon={
                              <Favorite className="mui-favorite-checkbox" />
                            }
                          />
                          <div className="add-wish">
                            <small>Add to Wish List</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                  <div className="section_2">
                    <div className="section_width">
                      <div className="section-desc">
                        <div className="description">
                          <h2>Description</h2>
                          <span className="product-description">
                            {parse(`<p>${product.desc}</p>`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="section_3">
                    <div className="section_width">
                      <div className="review_header">
                        <h2 ref={reviewsRef}>Product reviews</h2>
                      </div>
                      <div className="noreviews">
                        {product.reviews.length === 0 && (
                          <MessageBox>There is no review</MessageBox>
                        )}
                      </div>
                      <div className="prod-scroll">
                        {product.reviews?.map((review, index) => (
                          <div className="prod-review" key={index}>
                            <div className="prod-1">
                              <div className="reviewer">
                                <h4>{review.name}</h4>
                              </div>
                              <div className="rating">
                                <Ratings
                                  rating={review.rating}
                                  caption=""
                                  name="rating"
                                ></Ratings>
                              </div>
                              <div className="time-review">
                                <ReactTimeAgo
                                  date={Date.parse(review.createdAt)}
                                  locale="en-US"
                                />
                              </div>
                            </div>
                            <div className="prod-2">
                              <div className="desc">
                                <p>{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {product.reviews.length !== 0 && (
                        <div className="page-rev">
                          {/* <div className="page">
                          <span className="material-symbols-sharp">
                            favorite
                          </span>
                          <span className="fav-count">
                            {product.numWishList}
                          </span>
                        </div> */}
                          <div className="page-fav-rev">
                            <div className="page-fava-rev">
                              <i className="fa-regular fa-comment"></i>
                              <span className="rev-count">
                                {product.numReviews}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="section_4">
                    <div className="section_width">
                      <h2 className="review-product-header">Add a review</h2>
                      {userInfo ? (
                        <form action="" onSubmit={submitHandler}>
                          <div className="submit-rev">
                            <div className="rev-text-small">
                              <h4>Your review</h4>
                              <textarea
                                placeholder="Your review here..."
                                className="textarea"
                                name="comments"
                                id="comments"
                                cols="30"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="10"
                              ></textarea>
                              <div className="small-text">
                                <small>
                                  Your review must be at least 50 characters{" "}
                                  <span>
                                    <Link to="/review-guidelines">
                                      {" "}
                                      Full review guidelines
                                    </Link>
                                  </span>
                                </small>
                              </div>
                            </div>
                            <div className="rating-star">
                              <h4>Overall rating</h4>
                              <Rating
                                name="rating"
                                onChange={(e) => setRating(e.target.value)}
                              ></Rating>
                            </div>
                            <div className="submit-btn">
                              <button disabled={loadingCreateReview}>
                                Submit
                              </button>
                              {loadingCreateReview && <LoadingBox></LoadingBox>}
                            </div>
                          </div>
                        </form>
                      ) : (
                        <div className="message-box">
                          <MessageBox>
                            Please{" "}
                            <Link
                              to={`/signin?redirect=/product/${product.slug}`}
                            >
                              Sign In
                            </Link>{" "}
                            to write a review
                          </MessageBox>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="section_5">
                    <div className="slider-prod">
                      <div className="header-tag">
                        <h2>You may also like</h2>
                      </div>
                      <div className="related-product">
                        <div className="prod-list">
                          <Slider {...setting} className="slick-slider">
                            {products?.map((product, index) => (
                              <div className="related_card" key={index}>
                                <div className="sim-shirt">
                                  {product.discount > 0 && (
                                    <div className="item-discount">
                                      {product.discount}%
                                    </div>
                                  )}
                                  <Link to={`/product/${product.slug}`}>
                                    <img src={product.image} alt="" />
                                  </Link>
                                  <Link to={`/product/${product.slug}`}>
                                    <h4 className="sim-name">{product.name}</h4>
                                  </Link>
                                  {product.discount > 0 ? (
                                    <>
                                      {settings?.map((s, index) => (
                                        <>
                                          <div className="price" key={index}>
                                            {s.currencySign}
                                            {(
                                              product.price -
                                              (product.price *
                                                product.discount) /
                                                100
                                            )?.toFixed(2)}
                                          </div>
                                          <s className="discount">
                                            {s.currencySign}
                                            {product.price}
                                          </s>
                                        </>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {settings?.map((s, index) => (
                                        <div className="price" key={index}>
                                          {s.currencySign}
                                          {product.price}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </Slider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="product-footer">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductPage;
