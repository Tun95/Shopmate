import React, { useContext, useEffect, useState } from "react";
import "../NavBar/NavBarSR.css";
import gb from "../images/gb.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";

function NavBarSR(props) {
  const { showModal, showSModal } = props;

  const { state, dispatch } = useContext(Context);
  const { cart, userInfo } = state;

  const totalPrice = cart.cartItems.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  );

  //TOTAL SALES
  let TotalItemPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(totalPrice);

  //SELLER BOX
  const navigate = useNavigate();

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    // localStorage.removeItem("!userInfo" && "cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <div className="top-case">
      <div className="top-case-pad">
        <div className="admin-sign-reg">
          <div className="sign-reg">
            <div>
              <span>Hi! </span>
            </div>
            {userInfo ? (
              <div className="user-select">
                <ul>
                  <li>
                    <Link to="#">
                      <span>{userInfo.name} </span>
                      <i className="fa fa-caret-down"></i>
                    </Link>
                    <ul className="drop-list">
                      <li>
                        <div
                          className="prof"
                          onClick={() => {
                            navigate(`/profile/${userInfo._id}`);
                          }}
                        >
                          Profile
                        </div>
                      </li>
                      <li>
                        <Link to="/orderhistory">Orders </Link>
                      </li>

                      <li>
                        <div className="user-signout">
                          <Link to="#signout" onClick={signoutHandler}>
                            Sign Out
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="s-reg">
                <Link to={"/signin"} className="sign-reg">
                  {" "}
                  Sign In
                </Link>{" "}
                <span>or</span>
                <Link to={"/signup"} className="sign-reg">
                  {" "}
                  Register
                </Link>
              </div>
            )}
          </div>
          {userInfo && userInfo?.isAdmin && (
            <div className="admin-select">
              <ul>
                <li>
                  <Link to="#">
                    <span>Admin</span>
                    <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="admin-drop-list">
                    <li>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/admin/products">Products</Link>
                    </li>
                    <li>
                      <Link to="/admin/orderlist">Orders</Link>
                    </li>
                    <li>
                      <Link to="/admin/userlist">Users</Link>
                    </li>
                    <li>
                      <Link to="/admin/support">Support</Link>
                    </li>
                    <li>
                      <Link to="/admin/settings">Settings</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="list">
          <ul className="k-list">
            <Link to="/deals">
              <li>Daily Deals</li>
            </Link>
            <li>
              {userInfo && userInfo?.isSeller ? (
                <div className="seller-select-nav">
                  <Link to="#">
                    <span>Seller</span>
                    <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="seller-drop-list-nav">
                    <li>
                      <Link to="/seller/products">Products</Link>
                    </li>
                    <li>
                      <Link to="/seller/orderlist">Orders</Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <p onClick={showSModal} className="sell-link-nav">
                  Sell
                </p>
              )}
            </li>
            <Link to="/contact">
              <li>Help &amp; Contact</li>
            </Link>
          </ul>
        </div>

        <div className="currency-cart">
          <div className="currency">
            <img src={gb} alt="" width="20px" />
            <strong> £ GBP</strong>
          </div>
          <div className="cart" id="cart">
            <Link to="#" onClick={showModal}>
              <i className="fa-sharp fa-solid fa-bag-shopping"></i>
              <div className="cart-top-counter">
                <span>{cart.cartItems.length}</span>
              </div>
            </Link>
            <span className="qty">Your bag: {TotalItemPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBarSR;
