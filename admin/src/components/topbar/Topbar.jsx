import React, { useContext } from "react";
import "./topbar.css";
import pp2 from "../../images/pp2.png";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Context } from "../../Context/Context";

function Topbar() {
 const { state, dispatch } = useContext(Context);
 const { cart, userInfo } = state;
  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    // localStorage.removeItem("!userInfo" && "cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Shopmate Admin</span>
        </div>
        <div className="topRight">
          <div>
            <button onClick={signoutHandler}>Sign out</button>
          </div>
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img src={pp2} alt="" className="topAvater" />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
