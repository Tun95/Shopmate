import React from "react";
import { Link } from "react-router-dom";
import data from "../../data/data.json";
import "./footer.css";

function Footer() {
  const { categories } = data;
  return (
    <div>
      <footer className="footer-social">
        <div className="footer-list">
          <ul>
            {categories.slice(0, 5).map((item) => (
              <Link key={item.id} to={`/store?category=${item.cat}`}>
                <li>{item.cat}</li>
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
