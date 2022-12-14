import axios from "axios";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";
import "./cartScreen.css";

function CartScreen() {
  //FETCHING CARTITEMS
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {
    userInfo,
    cart: { cartItems },
  } = state;

  //CART QUANTITY
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.counInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
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
      return navigate("/signin?redirect=/shipping");
    } else {
      return navigate("/signin?redirect=/shipping");
    }
  };

  //BACK TO STORE
  const returnHandler = () => {
    navigate("/store");
  };

  console.log(cartItems);
  return (
    <div className="cart-mobile">
      <div className="cart-mobile-stle">
        <div className="cart-m-box">
          <div className="num-item-empty">
            <div className="num-item">
              <h2>{cartItems.reduce((a, c) => a + c.quantity, 0)}</h2>{" "}
              <h2 className="item-header">Items In Your Cart</h2>
            </div>
            <div className="cart-is-empty">
              {cartItems.length === 0 ? <div>Cart Is Empty</div> : ""}
            </div>
          </div>
          <div
            className={
              cartItems.length === 0 ? "design-control-box" : "active-box"
            }
          >
            {cartItems.map((item) => (
              <div key={item._id} className="cart-m-sections">
                <div className="cart-m-stayle-sec">
                  <div className="col-1">
                    <img src={item.image} alt="" className="item-image" />
                  </div>
                  <div className="col-2">
                    <div className="col-2-name">
                      <Link to={`/product/${item.slug}`}>
                        <h3>{item.name}</h3>
                      </Link>
                    </div>
                    <div className="keygen-col">
                      <span>{item.keygen}</span>
                    </div>
                    <div className="item-price">
                      {item.discount ? (
                        <div className="cart-price">
                          £
                          {(
                            item.price -
                            (item.price * item.discount) / 100
                          ).toFixed(0) * item.quantity}
                        </div>
                      ) : (
                        <div className="cart-price">
                          £{item.price.toFixed(0) * item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="item-color">
                      <label htmlFor="color">Color: </label>
                      <span>
                        <i className={item.color ? item.color : ""}></i>
                      </span>
                    </div>
                    <div className="item-size">
                      <label htmlFor="size">Size: </label>
                      <span>{item.size}</span>
                    </div>
                    <div className="item-quantity">
                      <label htmlFor="qty">Quantity</label>
                      <div className="item-qty-btn">
                        <button
                          className="reduce-qty"
                          disabled={item.quantity === 1}
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="item-quant">{item.quantity}</span>
                        <button
                          className="increase-qty"
                          disabled={item.quantity === item.countInStock}
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-remove">
                      <button onClick={() => removeItemHandler(item)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="back-shop-checkout">
            <div className="back-to-shop">
              <button className="back-to-shop-btn" onClick={returnHandler}>
                Back to Shop
              </button>
            </div>
            <div className="cart-checkout-sec">
              {cartItems.length === 0 ? (
                <button className="disable-checkout" disabled>
                  Checkout
                </button>
              ) : (
                <button
                  className="cart-checkout-btn"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartScreen;
