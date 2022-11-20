import React, { useContext } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Context } from "../../Context/Context";
import data from "../../data/data.json";
import MenuIcon from "@mui/icons-material/Menu";

function NavBar(props) {
  const { showModal, showSideBar } = props;
  const { state } = useContext(Context);
  const { cart } = state;
  const { categories } = data;

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
            <Link to="/">Shopmate</Link>
          </div>
          <div className="list">
            <ul>
              {categories.slice(0, 5).map((item) => (
                <Link key={item.id} to={`/store?category=${item.cat}`}>
                  <li>{item.cat}</li>
                </Link>
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
