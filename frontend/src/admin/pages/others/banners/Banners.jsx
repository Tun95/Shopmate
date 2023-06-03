import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../../../../common/footer/Footer";
import LoadingBox from "../../../../components/Utilities/message loading/LoadingBox";
import MessageBox from "../../../../components/Utilities/message loading/MessageBox";
import { getError } from "../../../../components/Utilities/util/Utils";
import { Context } from "../../../../Context/Context";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, banners: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function Banners() {
  const [{ loading, error, banners }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const { data } = await axios.get(`/api/banner`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(banners);

  return (
    <>
      {" "}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="others new-settings-edit ">
            <Helmet>
              <title>Banners</title>
            </Helmet>
            <div className="other_settings web_container ">
              <h1>Banners:</h1>
              <div className="content_settings container_shadow">
                <div className="inner_form">
                  <div className="form_group">
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        Banners:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-banner`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">BANNER</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>
                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {banners?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  {item.title}
                                </li>
                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-banner/${item._id}`
                                      );
                                    }}
                                    className="fa-solid fa-pen-to-square"
                                  ></i>
                                  &nbsp;
                                </li>
                              </ul>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default Banners;
