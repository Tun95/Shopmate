import React, { useContext, useReducer, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import bag from "../images/bag.png";
import { Helmet } from "react-helmet-async";
import { Context } from "../../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Slider from "../Slider/Slider";

const reducer = (state, action) => {
  switch (action.type) {
    case "POST_REQUEST":
      return { ...state, loading: true };
    case "POST_SUCCESS":
      return { ...state, loading: false };
    case "POST_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function Home() {
  const navigate = useNavigate();
  const navigateHandler = () => {
    navigate("/signup");
  };

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { settings, userInfo } = state;

  const [email, setEmail] = useState();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("email field is required", { position: "bottom-center" });
    } else {
      try {
        const { data } = await axios.post("/api/message/subscribe", {
          email,
        });
        dispatch({ type: "POST_SUCCESS", payload: data });
        toast.success("You have successfully subscribe to our newsletter", {
          position: "bottom-center",
        });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "POST_FAIL" });
      }
    }
  };

  return (
    <div className="home-main">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="home">
        <div className="banner">
          <div className="slider">
            <Slider />
          </div>
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
                  <strong>Registration is on - get ready for the Open</strong>
                </p>
                {!userInfo ? (
                  <button className="Register" onClick={navigateHandler}>
                    Register
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="subscribe">
          <div className="content-design">
            <div className="content-sub">
              <h3>Don't miss out on any of our products and offers!!!</h3>
              <p>
                Subscribe for shop news, updates, offers and receive
                notification
                <br />
                of new product uploaded daily
              </p>
              <div className="sub-con-e">
                <form action="" onSubmit={submitHandler}>
                  <div className="inp-icon-btn">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your e-mail here"
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                    />
                    <MailOutlineIcon id="icon" className="sharp" />
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
              <Link to="/orderhistory">
                <li>Track Order</li>
              </Link>
              <Link to="/returns">
                <li>Returns</li>
              </Link>
            </ul>
          </div>
          <div className="store-foot">
            <h4>WHAT'S IN STORE</h4>
            <ul>
              {settings?.map((s, index) => (
                <div key={index}>
                  <Link to={`/store?category=${s.navOne}`}>
                    <li>{s.navOne}</li>
                  </Link>
                  <Link to={`/store?category=${s.navTwo}`}>
                    <li>{s.navTwo}</li>
                  </Link>
                </div>
              ))}
              <Link to="/store">
                <li>Product A-Z</li>
              </Link>
              <Link to="/store">
                <li>Buy Gift Vouchers</li>
              </Link>
            </ul>
          </div>
          <div className="follow">
            <h4>FOLLOW US</h4>
            {settings?.map((s, index) => (
              <ul key={index}>
                <a
                  href={`${s.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>Facebook</li>
                </a>
                <a
                  href={`${s.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>Twitter</li>
                </a>
                <a
                  href={`${s.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>YouTube</li>
                </a>
              </ul>
            ))}
          </div>
          <div className="ltd">©2022 shopping Ltd</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
