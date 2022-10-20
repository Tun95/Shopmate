import React, { useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import bag from "../images/bag.png";
import { Helmet } from "react-helmet-async";

function Home() {
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate("/signup");
  };
  return (
    <div className="home-main">
      <Helmet>
        <title>Shopmore Home</title>
      </Helmet>
      <div className="home">
        <div className="banner">
          <Link to="./store">
            <button className="btn">View All</button>
          </Link>
        </div>

        <div className="spec">
          <div className="header-desc">
            <div className="header">
              <div className="header-img">
                <button className="sale">sale</button>
                <img src={bag} alt="" />
              </div>
              <div className="header-content">
                <h2>Vera Bradley</h2>
                <p>
                  Carry the day in style with this extra-large tote crafted in
                  our chic B.B. Collection textured PVC. Featuring colorful faux
                  leather trim, this tote offers a roomy interior plus just
                  enough perfectly placed
                </p>
                <Link to="./store">
                  <button className="shop-now">Shop Now</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="aside">
              <div className="aside-1">
                <div className="aside-cont-h">
                  <div className="aside-content">
                    <h1>WOW</h1>
                    <h2>
                      Check <br /> WHAT!
                    </h2>
                  </div>
                </div>
              </div>
              <div className="aside-2">
                <h2>MEN</h2>
              </div>
            </div>
            <div className="main">
              <div className="pop">
                <button>POP</button>
              </div>
              <div className="h-main-content">
                <h1>Let the Game begin</h1>
                <p className="main-content-reg">
                  <strong>Registration is on - get readey for the Open</strong>
                </p>
                <button className="Register" onClick={navigateHandler}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="subscribe">
          <div className="content-design">
            <div className="content-sub">
              <h3>10% Discount for your subscription</h3>
              <p>
                Carry the day in style with this extra-large tote crafted in our
                chic B.B. Collection <br />
                textured PVC. Featuring colorful faux leather trim,
                <br /> this tote offers a roomy interior.
              </p>
              <div className="sub-con-e">
                <form action="">
                  <div className="inp-icon-btn">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your e-mail here"
                      id="email"
                    />
                    <span className="material-symbols-sharp" id="icon">
                      mail
                    </span>
                    <button>Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="qts">
            <h4>QUESTIONS?</h4>
            <ul>
              <Link to="/contact">
                <li>Help</li>
              </Link>
              <Link to="">
                <li>Track Order</li>
              </Link>
              <Link to="">
                <li>Returns</li>
              </Link>
            </ul>
          </div>
          <div className="store-foot">
            <h4>WHAT'S IN STORE</h4>
            <ul>
              <Link to="/store?category=Women">
                <li>Women</li>
              </Link>
              <Link to="/store?category=Men">
                <li>Men</li>
              </Link>
              <Link to="/store">
                <li>Product A-Z</li>
              </Link>
              <Link to="">
                <li>Buy Gift Vouchers</li>
              </Link>
            </ul>
          </div>
          <div className="follow">
            <h4>FOLLOW US</h4>
            <ul>
              <Link to="">
                <li>Facebook</li>
              </Link>
              <Link to="">
                <li>Twitter</li>
              </Link>
              <Link to="">
                <li>YouTube</li>
              </Link>
            </ul>
          </div>
          <div className="ltd">©2022 shopping Ltd</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
