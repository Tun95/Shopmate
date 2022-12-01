import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import data from "../../data/data.json";
import { getError } from "../Utilities/Utils";
import "./footer.css";

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

function Footer() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const { data } = await axios.get("/api/category");
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_CATEGORY_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <footer className="footer-social">
        <div className="footer-list">
          <ul>
            {categories?.slice(0, 5).map((c, index) => (
              <Link key={index} to={`/store?category=${c.category}`}>
                <li>{c.category}</li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="social-icon">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://www.pinterest.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-pinterest"></i>
          </a>
          <a
            href="https://twitter.com/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a
            href="https://web.facebook.com/?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
        </div>
        <div className="ltd-last">
          <p>©2022 shopmate Ltd</p>
          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about-terms-privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
