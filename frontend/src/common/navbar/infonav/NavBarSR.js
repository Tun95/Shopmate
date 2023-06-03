import React, { useContext } from "react";
import "./styles.css";
import gb from "../../../components/images/gb.svg";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../../Context/Context";


function NavBarSR(props) {
  const { showModal, showSModal, currency } = props;

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { cart, settings, userInfo } = state;

  const totalPrice = cart.cartItems.reduce(
    (a, c) => a + (c.price - (c.price * c.discount) / 100) * c.quantity,
    0
  );

  //TOTAL SALES
  let TotalItemPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(totalPrice);

  //SELLER BOX
  const navigate = useNavigate();

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("!userInfo" && "cartItems");
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
                        <Link to={`/wishlist/${userInfo._id}`}>Wish List</Link>
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
                      <Link to="">
                        Manage{" "}
                        <i
                          style={{ position: "relative", top: "2px" }}
                          className="fa-solid fa-caret-right"
                        ></i>
                      </Link>
                      <ul className="nested_link">
                        {settings?.map((s, index) => (
                          <Link key={index} to={`/admin/settings/${s._id}`}>
                            <li>Settings</li>
                          </Link>
                        ))}
                        <Link to={`/admin/filters`}>
                          <li>Filters</li>
                        </Link>
                        <Link to={`/admin/banners`}>
                          <li>Banner</li>
                        </Link>
                        <Link to={`/admin/subscribers`}>
                          <li>Subscribers</li>
                        </Link>
                        {/* <Link to={`/admin/pages`}>
                          <li>Pages</li>
                        </Link> */}
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="list">
          <ul className="k-list">
            <Link to="/store?order=toprated">
              <li>Top Rated</li>
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
            {settings?.map((s, index) => (
              <strong key={index}>
                {s.currencySign} {s.currency}
              </strong>
            ))}
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
