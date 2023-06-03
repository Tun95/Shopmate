import React, { useContext, useState } from "react";
import "./styles.css";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Home from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../../Context/Context";

import Store from "@mui/icons-material/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ListIcon from "@mui/icons-material/List";
import Seller from "@mui/icons-material/Storefront";
import AdminPanel from "@mui/icons-material/AccountBalance";
import Dashboard from "@mui/icons-material/LineStyle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LiveHelp from "@mui/icons-material/LiveHelp";
import GroupIcon from "@mui/icons-material/Group";
import WorkRounded from "@mui/icons-material/WorkRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneIcon from "@mui/icons-material/Phone";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function SideBar(props) {
  const { state, dispatch: ctxDispatch } = useContext(Context);

  const { cart, settings, userInfo } = state;

  const { closeSideBar, openSideBar, currency } = props;

  const [openAccount, setOpenAccount] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openSeller, setOpenSeller] = useState(false);
  const [openManage, setOpenManage] = useState(false);

  //SIGNOUT HANDLER
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("!userInfo" && "cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  //SEARCH BOX
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/store/?query=${query}` : "/store");
  };

  const totalPrice = cart.cartItems.reduce(
    (a, c) => a + (c.price - (c.price * c.discount) / 100) * c.quantity,
    0
  );

  //TOTAL SALES
  let TotalItemPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(totalPrice);

  return (
    <div>
      {openSideBar && (
        <div className="side-bar">
          <div className="side-box-container">
            <div className="side-container">
              <div className="side-bar-top">
                <CloseIcon onClick={closeSideBar} className="close-sidebar" />
                <span>
                  Your bag:{" "}
                  <div className="side-bar-price">{TotalItemPrice}</div>
                </span>
              </div>
              <div className="side-bar-list">
                <div className="side-list-ul">
                  <ul>
                    <form action="" onSubmit={submitHandler}>
                      <span className="side-search">
                        <input
                          type="search"
                          placeholder="search..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="side-search-input"
                        />
                        <SearchIcon
                          className="side-search-icon"
                          onClick={submitHandler}
                        />
                      </span>
                    </form>
                    <li
                      className={
                        openAccount
                          ? "side-bar-main open active"
                          : "side-bar-main"
                      }
                    >
                      <span
                        className="sidebar-main"
                        onClick={() => setOpenAccount(!openAccount)}
                      >
                        <span className="sidebar-main-style">
                          <AccountBoxIcon className="sidebar-icons" />
                          {userInfo && userInfo.name
                            ? userInfo.name
                            : "My Account"}
                        </span>
                        <ExpandMoreIcon className="drop-down-menu-btn" />
                      </span>
                      <ul
                        className={
                          openAccount
                            ? "side-account-list open active"
                            : "side-account-list"
                        }
                      >
                        <div className="sb-content-list">
                          {!userInfo ? (
                            <li className="inner-list">
                              <Link to="/signin">
                                <LoginIcon className="sidebar-icons" />
                                Sign In
                              </Link>
                            </li>
                          ) : (
                            <div>
                              <li className="inner-list">
                                <Link to={`/profile/${userInfo._id}`}>
                                  <AccountCircleIcon className="sidebar-icons" />
                                  Profile
                                </Link>
                              </li>
                              <li className="inner-list">
                                <Link to="/orderhistory">
                                  <HistoryIcon className="sidebar-icons" />
                                  Order History
                                </Link>
                              </li>
                              <li className="inner-list">
                                <Link to={`/wishlist/${userInfo._id}`}>
                                  {" "}
                                  <FavoriteBorderIcon className="sidebar-icons" />
                                  Wish List
                                </Link>
                              </li>
                            </div>
                          )}
                        </div>
                      </ul>
                    </li>
                    <li>
                      <Link to="/">
                        <Home className="sidebar-icons" />
                        Home
                      </Link>
                    </li>

                    <li>
                      <Link to="/store">
                        <Store className="sidebar-icons" />
                        Store
                      </Link>
                    </li>

                    <li>
                      <Link to="/cartscreen">
                        <LocalMallIcon className="sidebar-icons" />
                        <span className="side-badge">
                          {cart.cartItems?.length}
                        </span>
                        Cart
                      </Link>
                    </li>

                    <li
                      className={
                        openCategory
                          ? "side-bar-main open active side-category"
                          : "side-bar-main side-category"
                      }
                    >
                      <span
                        className="sidebar-main"
                        onClick={() => setOpenCategory(!openCategory)}
                      >
                        <span className="sidebar-main-style">
                          <ListIcon className="sidebar-icons" />
                          Category
                        </span>
                        <ExpandMoreIcon className="drop-down-menu-btn" />
                      </span>
                      <ul
                        className={
                          openCategory
                            ? "side-account-list open active"
                            : "side-account-list"
                        }
                      >
                        {settings?.map((s, index) => (
                          <>
                            <li className="inner-list" key={index}>
                              <Link to={`/store?category=${s.navOne}`}>
                                {s.navOne}
                              </Link>
                            </li>
                            <li className="inner-list">
                              <Link to={`/store?category=${s.navTwo}`}>
                                {s.navTwo}
                              </Link>
                            </li>
                            <li className="inner-list">
                              <Link to={`/store?category=${s.navThree}`}>
                                {s.navThree}
                              </Link>
                            </li>
                            <li className="inner-list">
                              <Link to={`/store?category=${s.navFour}`}>
                                {s.navFour}
                              </Link>
                            </li>
                            <li className="inner-list">
                              <Link to={`/store?category=${s.navFive}`}>
                                {s.navFive}
                              </Link>
                            </li>
                          </>
                        ))}
                      </ul>
                    </li>
                    {userInfo?.isAdmin ? (
                      <li
                        className={
                          openAdmin
                            ? "side-bar-main open active side-admin"
                            : "side-bar-main side-admin"
                        }
                      >
                        <span
                          className="sidebar-main"
                          onClick={() => setOpenAdmin(!openAdmin)}
                        >
                          <span className="sidebar-main-style">
                            <AdminPanel className="sidebar-icons" />
                            Admin
                          </span>
                          <ExpandMoreIcon
                            className={
                              openAdmin
                                ? "drop-down-menu-btn open"
                                : "drop-down-menu-btn"
                            }
                          />
                        </span>
                        <ul
                          className={
                            openAdmin
                              ? "side-account-list open"
                              : "side-account-list"
                          }
                        >
                          <li className="inner-list">
                            <Link to="/admin/dashboard">
                              <Dashboard className="sidebar-icons" />
                              Dashboard
                            </Link>
                          </li>
                          <li className="inner-list">
                            <Link to="/admin/products">
                              <AddBoxIcon className="sidebar-icons" />
                              Products
                            </Link>
                          </li>
                          <li className="inner-list">
                            <Link to="/admin/orderlist">
                              <WorkRounded className="sidebar-icons" />
                              Orders
                            </Link>
                          </li>
                          <li className="inner-list">
                            <Link to="/admin/userlist">
                              <GroupIcon className="sidebar-icons" />
                              Users
                            </Link>
                          </li>
                          <li className="inner-list">
                            <Link to="/admin/support">
                              <LiveHelp className="sidebar-icons" />
                              Support
                            </Link>
                          </li>
                          <li className="inner-list">
                            <span
                              className="sidebar-main"
                              onClick={() => setOpenManage(!openManage)}
                            >
                              <Link
                                to=""
                                style={{ position: "relative", right: "10px" }}
                              >
                                <SettingsIcon className="sidebar-icons" />
                                Manage
                              </Link>
                              <ExpandMoreIcon
                                className={
                                  openManage
                                    ? "drop-down-menu-btn open"
                                    : "drop-down-menu-btn"
                                }
                              />
                            </span>
                            <ul
                              className={
                                openManage
                                  ? "side-account-list open"
                                  : "side-account-list"
                              }
                            >
                              <li className="inner-list">
                                {settings?.map((s, index) => (
                                  <Link
                                    key={index}
                                    to={`/admin/settings/${s._id}`}
                                  >
                                    <i className="fa-solid fa-gears sidebar-icons"></i>
                                    Settings
                                  </Link>
                                ))}
                              </li>
                              <li className="inner-list">
                                <Link to="/admin/filters">
                                  <i className="fa-solid fa-filter"></i>
                                  Filters
                                </Link>
                              </li>
                              <li className="inner-list">
                                <Link to="/admin/banners">
                                  <i className="fa-solid fa-rectangle-ad sidebar-icons"></i>
                                  Banner
                                </Link>
                              </li>
                              <li className="inner-list">
                                <Link to="/admin/subscribers">
                                  <i className="fa-solid fa-users sidebar-icons"></i>
                                  Subscriber
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      ""
                    )}
                    {userInfo?.isSeller ? (
                      <li
                        className={
                          openSeller
                            ? "side-bar-main open active side-seller"
                            : "side-bar-main side-seller"
                        }
                      >
                        <span
                          className="sidebar-main"
                          onClick={() => setOpenSeller(!openSeller)}
                        >
                          <span className="sidebar-main-style">
                            <Seller className="sidebar-icons" />
                            Seller
                          </span>
                          <ExpandMoreIcon className="drop-down-menu-btn" />
                        </span>
                        <ul
                          className={
                            openSeller
                              ? "side-account-list open"
                              : "side-account-list"
                          }
                        >
                          <li className="inner-list">
                            <Link to="/seller/products">
                              <AddBoxIcon className="sidebar-icons" />
                              Products
                            </Link>
                          </li>
                          <li className="inner-list">
                            <Link to="/seller/orderlist">
                              <WorkRounded className="sidebar-icons" />
                              Orders
                            </Link>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      ""
                    )}
                    <li className="side-contact">
                      <Link to="/contact">
                        <PhoneIcon className="sidebar-icons" />
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="side-bar-signout">
                  <span className="side-bar-signout-box">
                    {userInfo && (
                      <span onClick={signoutHandler}>
                        <LogoutIcon className="sidebar-icons" />
                        Sign Out
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;
