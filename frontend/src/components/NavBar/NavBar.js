import React, { useContext, useReducer } from "react";
import "./NavBar.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getError } from "../Utilities/Utils";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import data from "../../data/data.json";
import Menu from "@material-ui/icons/Menu";
import SideBar from "./SideBar";

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

  // //FETCHING CATEGORIES
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const { data } = await axios.get("/api/products/categories");
  //       setCategories(data);
  //     } catch (err) {
  //       toast.error(getError(err), { position: "bottom-center" });
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  return (
    <div className="nav-cart">
      <nav>
        <div className="nav-bar">
          <div className="logo">
            <Link to="/">Shopmore</Link>
          </div>
          <div className="list">
            <ul>
              {categories.map((item) => (
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
              <span id="cart-shopmore" className="material-symbols-sharp">
                shopping_bag
              </span>
              <div className="count-cart-items">
                <span>{cart.cartItems.length}</span>
              </div>
            </div>
          </div>
          <div className="sidebar-nav">
            <div className="side-bar-icon">
              <Menu className="sidebarnav-menu-icon" onClick={showSideBar} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
