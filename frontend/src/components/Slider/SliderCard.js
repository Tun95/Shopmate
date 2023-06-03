import React, { useContext, useEffect, useReducer } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Context } from "../../Context/Context.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../Utilities/util/Utils.js";
import parse from "html-react-parser";
import "./styles.css";

function SliderCard() {
  const { state } = useContext(Context);
  const { banners } = state;

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <>
      <Slider {...settings} className="slick-slider">
        {banners?.map((item, index) => (
          <div key={index} className="box  top ">
            <div className="left">
              {item.adslink === "" ? (
                <img src={item.background} alt="" />
              ) : (
                <a
                  href={`${item.adslink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={item.background} alt="" />
                </a>
              )}
              <span className="content">
                {parse(`<p>${item?.descriptions}</p>`)}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}

export default SliderCard;
