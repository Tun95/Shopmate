import React, { useContext, useEffect, useReducer } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Context } from "../../Context/Context";
import data from "../../data/data.json";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { getError } from "../Utilities/Utils";



function NavBar(props) {
  const { showModal, showSideBar } = props;

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { settings, cart, userInfo } = state;

  //SEARCH BOX
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/store/?query=${query}` : "/store");
  };

  return (
    <div className="nav-cart">
      <nav>
        <div className="nav-bar">
          <div className="logo">
            {settings?.map((s, index) => (
              <Link key={index} to="/">
                {s.webname}
              </Link>
            ))}
          </div>
          <div className="list">
            <ul>
              {settings?.map((s, index) => (
                <div key={index}>
                  <Link to={`/store?category=${s.navOne}`}>
                    <li>{s.navOne}</li>
                  </Link>
                  <Link to={`/store?category=${s.navTwo}`}>
                    <li>{s.navTwo}</li>
                  </Link>
                  <Link to={`/store?category=${s.navThree}`}>
                    <li>{s.navThree}</li>
                  </Link>
                  <Link to={`/store?category=${s.navFour}`}>
                    <li>{s.navFour}</li>
                  </Link>
                  <Link to={`/store?category=${s.navFive}`}>
                    <li>{s.navFive}</li>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
          <div className="search-bar-cart">
            <form className="search-input" onSubmit={submitHandler}>
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                name="q"
                id="q"
                value={query}
                aria-describedby="icon-search"
                placeholder="search anything"
                className="search-inp"
              />
              <button id="icon-search" onClick={submitHandler}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </form>
            <div onClick={showModal} className="cart">
              <i className="fa-sharp fa-solid fa-bag-shopping"></i>
              <div className="count-cart-items">
                <span>{cart.cartItems.length}</span>
              </div>
            </div>
          </div>
          <div className="sidebar-nav">
            <div className="side-bar-icon">
              <MenuIcon
                className="sidebarnav-menu-icon"
                onClick={showSideBar}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
