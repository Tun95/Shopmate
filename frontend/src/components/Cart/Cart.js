import React, { useState, useContext } from "react";
import "../Cart/Cart.css";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../../base_url/Base_URL";

function Cart(props) {
  const { closeModal, openModal } = props;

  //STRIPE SECTION
  const KEY = process.env.REACT_APP_STRIPE;
  const [stripeToken, setStripeToken] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };
  console.log(stripeToken);

  //FETCHING CARTITEMS
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {
    userInfo,
    settings,
    cart: { cartItems },
  } = state;

  //CART QUANTITY
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`${URL}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry, Product is out of stock", {
        position: "bottom-center",
      });
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  //REMOVE ITEMS
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
    toast.error(`${item.name} is successfully removed from cart`, {
      position: "bottom-center",
    });
  };

  //CHECKOUT
  const navigate = useNavigate();
  const checkoutHandler = () => {
    if (!userInfo) {
      toast.error("You need to login to checkout", {
        position: "bottom-center",
      });
      return navigate("signin?redirect=/shipping");
    } else {
      return navigate("signin?redirect=/shipping");
    }
  };
  return (
    <div>
      {openModal && (
        <div className="cart-items-modal">
          <div className="unknown">
            <div className="cart-items-nav">
              <div className="nav cart-list">
                <div className="cart-items">
                  <div className="cart-herader-cancel">
                    <div className="cart-header">
                      <h2>
                        <span>
                          {cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </span>{" "}
                        Items In Your Cart
                      </h2>
                    </div>
                    <i onClick={closeModal} className="fa-solid fa-xmark"></i>
                  </div>
                  <div className="cart-content">
                    <div className="empty-cart">
                      {cartItems.length === 0 ? <div>Cart Is Empty</div> : ""}
                    </div>

                    <div className="table-data">
                      <div className="table-body-style">
                        <div className="table-header">
                          <ul>
                            <li className="item">Item</li>
                            <li className="size">Size</li>
                            <li className="quantity">Quantity</li>
                            <li className="price">Price</li>
                          </ul>
                        </div>
                        <div
                          className={
                            cartItems.length !== 0 ? "table-scroll" : ""
                          }
                        >
                          {cartItems.map((item, index) => (
                            <div key={index} className="table-body">
                              <div className="first-row">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="small"
                                />
                                <div className="name-gen">
                                  <Link to={`/product/${item.slug}`}>
                                    <h3 onClick={closeModal}>{item.name}</h3>
                                  </Link>
                                  <div className="gen">
                                    {item.keygen}
                                    {/* CHECK */}{" "}
                                    <img
                                      src={item.color}
                                      alt={item.color}
                                      className="color_image_size"
                                    />
                                  </div>
                                  <span
                                    onClick={() => removeItemHandler(item)}
                                    className="remove-item"
                                  >
                                    <CloseIcon
                                      onClick={closeModal}
                                      className="close-reg"
                                    />
                                    <span className="remove-text">Remove</span>
                                  </span>
                                </div>
                              </div>
                              <div className="second-row">
                                <div className="clothe-size">
                                  {item.size === "" ? "" : item.size}
                                </div>
                              </div>
                              <div className="third-row">
                                <button
                                  disabled={item.quantity === 1}
                                  onClick={() =>
                                    updateCartHandler(item, item.quantity - 1)
                                  }
                                  className="remove-from"
                                >
                                  -
                                </button>
                                <div className="quantity">
                                  <span>{item.quantity}</span>
                                </div>
                                <button
                                  disabled={item.quantity === item.countInStock}
                                  onClick={() =>
                                    updateCartHandler(item, item.quantity + 1)
                                  }
                                  className="add-to"
                                >
                                  +
                                </button>
                              </div>
                              {settings?.map((s, index) => (
                                <div className="forth-row" key={index}>
                                  {item.discount ? (
                                    <>
                                      <div className="cart-price" key={index}>
                                        {s.currencySign}
                                        {(
                                          item.price -
                                          (item.price * item.discount) / 100
                                        ).toFixed(0) * item.quantity}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="cart-price">
                                      {s.currencySign}
                                      {item.price.toFixed(0) * item.quantity}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      {cartItems.length !== 0 ? (
                        <div className="table-footer">
                          <div className="check-shop">
                            <div className="shop-now">
                              <Link to="/store">
                                <button onClick={closeModal}>
                                  Back to Shop
                                </button>
                              </Link>
                            </div>
                            <div className="checkout" onClick={closeModal}>
                              <button
                                disabled={cartItems.length === 0}
                                className="checkout"
                                onClick={checkoutHandler}
                              >
                                Checkout
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
