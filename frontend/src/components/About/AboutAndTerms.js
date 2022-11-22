import axios from "axios";
import React, { useEffect, useReducer } from "react";
import Footer from "../Footer/Footer";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import { getError } from "../Utilities/Utils";
import "./aboutandterms.css";
import parse from "html-react-parser";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, others: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function AboutAndTerms() {
  const [{ loading, error, others }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //FETCH ALL
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/settings");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  console.log(others);

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
                  {others.map((item) => (
                    <div className="about-section-block">
                      <h2>{item.title}</h2>
                      <p>{parse(item.description)}</p>
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

export default AboutAndTerms;
