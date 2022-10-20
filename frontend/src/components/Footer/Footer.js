import React from "react";
import { Link } from "react-router-dom";
import facebook from "../images/facebook.png";
import instagram from "../images/instagram.png";
import twitter from "../images/twitter.png";
import pinterest from "../images/pinterest.png";
import data from "../../data/data.json";
import "./footer.css";

function Footer() {
  const { categories } = data;
  return (
    <div>
      <footer className="footer-social">
        <div className="footer-list">
          <ul>
            {categories.map((item) => (
              <Link key={item.id} to={`/store?category=${item.cat}`}>
                <li>{item.cat}</li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="social-icon">
          <img src={instagram} alt="" />
          <img src={pinterest} alt="" />
          <img src={twitter} alt="" />
          <img src={facebook} alt="" />
        </div>
        <div className="ltd-last">
          <p>@2022 shopmate Ltd</p>
          <ul>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
