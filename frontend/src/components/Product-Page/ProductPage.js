import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import { Link, useParams } from "react-router-dom";
import "../Product-Page/ProductPage.css";
import Rating from "@mui/material/Rating";
import { Helmet } from "react-helmet-async";
import Ratings from "../Ratings/Ratings";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import axios from "axios";
import { getError } from "../Utilities/Utils";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";

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
function ProductPage(props) {
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
  } = state;
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (cartItems.length > 0 && data.seller._id !== cartItems[0].seller._id) {
      dispatch({
        type: "CART_ADD_ITEM_FAIL",
        payload: `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
      });
      toast.error(
        `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
        {
          position: "bottom-center",
        }
      );
    } else {
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
    }
  };

  //PRODUCT REVIEWS
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment && !rating) {
      toast.error("Please enter comment and select rating of your choice", {
        position: "bottom-center",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "CREATE_SUCCESS", payload: { seller: data.seller } });
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
  };

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="section-footer">
          <div className="sections-blocks">
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <div className="sections-blocks-de">
              <div className="sections">
                <div className="section-1-style">
                  <div className="section-1">
                    <div className="image-sec">
                      <div className="img">
                        <div className="img-large">
                          <img src={selectedImage || product.image} alt="" />
                        </div>
                        <div className="img-small-l">
                          <div className="image-selected-preview-prod">
                            {[product.image, ...product.images].map((x) => (
                              <span
                                key={x}
                                onClick={() => setSelectedImage(x)}
                                className={`${
                                  x === selectedImage ? "selected-image" : ""
                                }`}
                              >
                                <img src={x} alt="" />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="prod-details">
                      <div className="prod-details-align">
                        <div className="prod-top">
                          <ul>
                            <div className="home">
                              <Link to="/">
                                <li>Home</li>
                              </Link>
                            </div>
                            <Link to="/store">
                              <li>All Categories</li>
                            </Link>
                            <Link
                              to="/store?category=Men"
                              className="last-child"
                            >
                              <li>Men's Clothing &amp; Accessories</li>
                            </Link>
                          </ul>
                        </div>
                        <div className="prod-rating">
                          <Ratings rating={product.rating}></Ratings>
                          <div className="count-stock">
                            {product.countInStock === 0 ? (
                              <span className="danger">Unavailable</span>
                            ) : (
                              <span className="success">In Stock</span>
                            )}
                          </div>
                        </div>

                        <div className="prod-title">
                          <h2>{product.name}</h2>
                        </div>
                        {product.seller ? (
                          <div className="seller-name-link">
                            <h4>Seller: </h4>
                            <Link to={`/sellers-screen/${product.seller._id}`}>
                              {product.seller.seller.name}
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="price">£{product.price}</div>
                        <div className="product-color">
                          <h4>Color</h4>
                          <ul className="ul-color-prod">
                            {product.color?.map((c, index) => (
                              <li
                                key={index}
                                onClick={() => setColor(c)}
                                className={`${color === c ? "active" : ""}`}
                              >
                                <i className={c}></i>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="product-size-p">
                          <div className="size-header">
                            <h4>Size</h4>
                            <h3>Size guide</h3>
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
                        <div>
                          <div className="third-row">
                            <button
                              disabled={quantity === 1}
                              onClick={() => handleQuantity("dec")}
                              className="remove-from"
                            >
                              -
                            </button>
                            <div className="quantity">
                              <span>{quantity}</span>
                            </div>
                            <button
                              disabled={product.countInStock === 0}
                              onClick={() => handleQuantity("inc")}
                              className="add-to"
                            >
                              +
                            </button>
                          </div>

                          <div className="add-cart-wish">
                            {product.countInStock === 0 ? (
                              <button disabled className="out-o-stock">
                                Out of Stock
                              </button>
                            ) : (
                              <div className="add-cart">
                                <button onClick={addToCartHandler}>
                                  Add to cart
                                </button>
                              </div>
                            )}
                            {/* <div className="wish-list">
                              <span className="material-symbols-sharp">
                                favorite
                              </span>
                              <div className="add-wish">
                                <p>Add to Wish List</p>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-product-desc">
                  <div className="section-prod-desc">
                    <div className="section-desc">
                      <div className="description">
                        <h2>Description</h2>
                        <span className="product-description">
                          {product.desc}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-2">
                  <div className="section-2-design">
                    <div>
                      <h2 ref={reviewsRef}>Product reviews</h2>
                    </div>
                    <div className="noreviews">
                      {product.reviews.length === 0 && (
                        <MessageBox>There is no review</MessageBox>
                      )}
                    </div>
                    <div className="prod-scroll">
                      {product.reviews?.map((review, id) => (
                        <div className="prod-review" key={id}>
                          <div className="prod-1">
                            <div className="rating">
                              <Ratings
                                rating={review.rating}
                                caption=""
                                name="rating"
                              ></Ratings>
                            </div>
                            <div className="reviewer">
                              <h4>{review.name}</h4>
                            </div>
                            <div className="time-review">
                              <p>{review.createdAt.substring(0, 10)}</p>
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
                          <span className="fav-count">113</span>
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

                <div className="section-3">
                  <div className="submit-implement">
                    <h2 className={!userInfo ? "review-header" : ""}>
                      Add a review
                    </h2>
                    {userInfo ? (
                      <form action="" onSubmit={submitHandler}>
                        <div className="submit-rev">
                          <div className="sub-1">
                            <div className="your-rev">
                              <h4>Your review</h4>
                            </div>
                            <div className="over-all">
                              <h4>Overall rating</h4>
                            </div>
                          </div>
                          <div className="sub-2">
                            <div className="your-rev-text">
                              <div className="rev-text-small">
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
                                  <p>
                                    Your review must be at least 50 characters{" "}
                                    <span>
                                      <Link to="#">
                                        {" "}
                                        Full review guidelines
                                      </Link>
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="rating-star">
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
                <div className="section-4">
                  <div className="slider-prod">
                    <div className="header-tag">
                      <h2>You may also like</h2>
                    </div>
                    <div className="related-product">
                      <div className="prod-list">
                        {products?.map((product, index) => (
                          <div className="sim-shirt" key={index}>
                            <Link to={`/product/${product.slug}`}>
                              <img src={product.image} alt="" />
                            </Link>
                            <Link to={`/product/${product.slug}`}>
                              <h4 className="sim-name">{product.name}</h4>
                            </Link>
                            <div className="price">£{product.price}</div>
                          </div>
                        ))}
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
        </div>
      )}
    </div>
  );
}

export default ProductPage;
