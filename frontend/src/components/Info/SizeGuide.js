import React, { useContext } from "react";
import Footer from "../Footer/Footer";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import "./styles.css";
import parse from "html-react-parser";
import { Context } from "../../Context/Context";

function SizeGuide() {
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { loading, error, settings } = state;

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="about">
            <div className="about-container">
              <div className="about-box">
                <div className="about-section">
                  {settings.map((s, index) => (
                    <div className="about-section-block" key={index}>
                      {parse(`<p>${s?.sizeGuide}</p>`)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default SizeGuide;
