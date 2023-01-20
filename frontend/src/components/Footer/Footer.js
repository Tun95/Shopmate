import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import "./footer.css";

function Footer() {
  const { state, dispatch } = useContext(Context);
  const { settings } = state;

  return (
    <div>
      <footer className="footer-social">
        <div className="footer-list">
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
        {settings?.map((s, index) => (
          <div className="social-icon" key={index}>
            <a
              href={`${s.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href={`${s.pinterest}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-pinterest"></i>
            </a>
            <a href={`${s.twitter}`} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href={`${s.facebook}`} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        ))}
        <div className="ltd-last">
          <p>©2022 shopmate Ltd</p>
          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
