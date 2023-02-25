import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../../base_url/Base_URL";
import Footer from "../../../../components/Footer/Footer";
import LoadingBox from "../../../../components/Utilities/LoadingBox";
import MessageBox from "../../../../components/Utilities/MessageBox";
import { getError } from "../../../../components/Utilities/Utils";
import { Context } from "../../../../Context/Context";
import "./styles.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, other: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CATEGORY_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_BRAND_REQUEST":
      return { ...state, loading: true };
    case "FETCH_BRAND_SUCCESS":
      return { ...state, loading: false, brands: action.payload };
    case "FETCH_BRAND_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SIZE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SIZE_SUCCESS":
      return { ...state, loading: false, sizes: action.payload };
    case "FETCH_SIZE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_PRICE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PRICE_SUCCESS":
      return { ...state, loading: false, prices: action.payload };
    case "FETCH_PRICE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_COLOR_REQUEST":
      return { ...state, loading: true };
    case "FETCH_COLOR_SUCCESS":
      return { ...state, loading: false, colors: action.payload };
    case "FETCH_COLOR_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
function Filters() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [
    { loading, error, categories, colors, brands, sizes, prices },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const { data } = await axios.get(`${URL}/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_CATEGORY_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(categories);

  //FETCH ALL BRANDS
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_BRAND_REQUEST" });
      try {
        const { data } = await axios.get(`${URL}/api/brand`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_BRAND_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_BRAND_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(brands);

  //FETCH ALL SIZE
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_SIZE_REQUEST" });
      try {
        const { data } = await axios.get(`${URL}/api/size`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SIZE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_SIZE_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(sizes);

  //FETCH ALL PRICE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${URL}/api/price`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_PRICE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_PRICE_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(prices);

  //FETCH ALL COLOR
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${URL}/api/color`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_COLOR_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_COLOR_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(colors);

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
              <title>Filters</title>
            </Helmet>
            <div className="other_settings web_container ">
              <h1>Filters:</h1>
              <div className="content_settings container_shadow">
                <div className="inner_form">
                  <div className="form_group">
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        CATEGORIES:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-category`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">CATEGORY</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>
                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {categories?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  {item.category}
                                </li>
                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-category/${item._id}`
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
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        SIZE:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-size`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">SIZE</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>

                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {sizes?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  {item.size}
                                </li>

                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-size/${item._id}`
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
                    {/* BRAND*/}
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        BRANDS:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-brand`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">BRANDS</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>

                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {brands?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  {item.brand}
                                </li>

                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-brand/${item._id}`
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
                    {/* PRICE */}
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        PRICES:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-price`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">PRICES</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>

                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {prices?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  {item.priceSpan}
                                </li>

                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-price/${item._id}`
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
                    {/* COLOR */}
                    <div className="admin-settings-section filter-settings">
                      <h3 className="settingsTitle newsLetterTitle FilterTitle">
                        COLOR:
                      </h3>
                      <i
                        onClick={() => {
                          navigate(`/admin/create-color`);
                        }}
                        className="fa-solid fa-square-plus filterPlus"
                      ></i>
                      <div className="admin-settings-table filter-settings-table">
                        <div className="admin-settings-table-header">
                          <ul className="filter-settings-header">
                            <li className="admin-settings-item">COLOR</li>
                            <li className="admin-settings-actions">EDIT</li>
                          </ul>
                        </div>

                        <div className="admin-settings-table-body">
                          <div className="admin-settings-table-row filter-settings-list filter-style">
                            {colors?.map((item) => (
                              <ul
                                className="admin-settings-item-list filter-settings-list"
                                key={item._id}
                              >
                                <li className="admin-item-title">
                                  <span>{item.colorName}</span>
                                  <img src={item.color} alt="color" />
                                </li>
                                <li className="admin-settings-btn-view">
                                  <i
                                    onClick={() => {
                                      navigate(
                                        `/admin/update-color/${item._id}`
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

export default Filters;
