import React, { useContext, useEffect, useReducer } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Context } from "../../Context/Context";
import data from "../../data/data.json";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { getError } from "../Utilities/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CATEGORY_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function NavBar(props) {
  const { showModal, showSideBar } = props;
  const { state } = useContext(Context);
  const { cart, userInfo } = state;

  const [{ loading, error, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //SEARCH BOX
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/store/?query=${query}` : "/store");
  };

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const { data } = await axios.get("/api/category", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_CATEGORY_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="nav-cart">
      <nav>
        <div className="nav-bar">
          <div className="logo">
            <Link to="/">Shopmate</Link>
          </div>
          <div className="list">
            <ul>
              {categories?.slice(0, 5)?.map((c, index) => (
                <Link key={index} to={`/store?category=${c.category}`}>
                  <li>{c.category}</li>
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
