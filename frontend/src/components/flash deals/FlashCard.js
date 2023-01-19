import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.css";
import { Context } from "../../Context/Context";


const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i className="fa-solid fa-angle-left"></i>
      </button>
    </div>
  );
};
function FlashCard(props) {
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { settings } = state;

  const { simProducts, currencySign } = props;

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1324,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        
        },
      },
      {
        breakpoint: 880,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 414,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Slider {...setting}>
        {simProducts?.slice(5, 13).map((sim, index) => (
          <div key={index} className="flash_card">
            <div className="dress">
              <div className="dress_box">
                <span>
                  <span className={sim.discount > 0 ? "item-discount" : ""}>
                    {sim.discount > 0 && <>{sim.discount}%</>}
                  </span>
                  <Link to={`/product/${sim.slug}`}>
                    <img src={sim.image} alt="" className="img" />
                  </Link>
                </span>
                <div className="sim-p-name">
                  <div className="pname">
                    <Link to={`/product/${sim.slug}`}>
                      <h4>{sim.name}</h4>
                    </Link>

                    <span className="unknow_slick">
                      {sim.discount > 0 ? (
                        <>
                          <div key={index}>
                            <span className="price">
                              {currencySign}
                              {(
                                sim.price -
                                (sim.price * sim.discount) / 100
                              )?.toFixed(2)}
                            </span><br />
                            <s className="price-discount">
                              {currencySign}
                              {sim.price}
                            </s>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="price">
                            {currencySign}
                            {sim.price}
                          </div>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}

export default FlashCard;
