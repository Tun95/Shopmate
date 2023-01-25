import React, { useReducer, useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Store.css";
import data from "../../data/data.json";
import StoreItems from "./StoreItems";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SimilarProduct from "./SimilarProduct";
import { Helmet } from "react-helmet-async";

import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import MessageBox from "../Utilities/MessageBox";
import LoadingBox from "../Utilities/LoadingBox";
import { getError } from "../Utilities/Utils";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";
import { Context } from "../../Context/Context";
import Slider from "../Slider/Slider";
import FlashDeal from "../flash deals/FlashDeal";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };

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

    case "FETCH_SIM_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SIM_SUCCESS":
      return { ...state, simProducts: action.payload, loading: false };
    case "FETCH_SIM_FAIL":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

function Store(props) {
  const { currencySign } = props;

  const { state } = useContext(Context);
  const { userInfo, prices, colors } = state;

  const { genderselect, productsize } = data;

  const [activeSize, setActiveSize] = useState("");

  //Brand

  //Color Style 50mins
  const [activeColor, setActiveColor] = useState("");

  // //PRODUCT FILTER

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const gender = sp.get("gender") || "all";
  const color = sp.get("color") || "all";
  const size = sp.get("size") || "all";
  const price = sp.get("price") || "all";
  const brand = sp.get("brand") || "all";
  const order = sp.get("order") || "all";
  const page = parseInt(sp.get("page") || 1);

  // //PRICE RANGE
  // const [price, setPrice] = useState([0, 100]);
  // const updateRange = (e, price) => {
  //   setPrice(price);
  //   console.log(price);
  // };

  const [
    {
      loading,
      error,
      products,
      simProducts,
      brands,

      sizes,
      categories,
      pages,
      countProducts,
    },
    dispatch,
  ] = useReducer(reducer, {
    products: [],
    simProducts: [],
    loading: true,
    error: "",
  });

  //&price=${price}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/products/store?page=${page}&query=${query}&order=${order}&category=${category}&gender=${gender}&color=${color}&size=${size}&price=${price}&brand=${brand}`
        );
        window.scrollTo(0, 0);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [category, brand, color, size, gender, page, price, query, order]);

  //&price=${filterPrice}
  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterGender = filter.gender || gender;
    const filterColor = filter.color || color;
    const filterSize = filter.size || size;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    const filterBrand = filter.brand || brand;
    return `/store?query=${filterQuery}&category=${filterCategory}&order=${sortOrder}&gender=${filterGender}&color=${filterColor}&size=${filterSize}&price=${filterPrice}&brand=${filterBrand}`;
  };
  console.log(products);

  //SIM PRODUCTS
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_SIM_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SIM_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_SIM_FAIL", payload: error.message });
      }
    };
    fetchData();
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 210,
      },
    },
  };

  //EMAIL SUBSCIBER
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

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/category");
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_CATEGORY_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  //FETCH ALL BRANDS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/brand");
        dispatch({ type: "FETCH_BRAND_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_BRAND_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  //FETCH ALL SIZE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/size");
        dispatch({ type: "FETCH_SIZE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_SIZE_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="content-cloth">
      <Helmet>
        <title>Store</title>
      </Helmet>

      <div className="container">
        <div className="banner-container">
          <div className="banner">
            <div className="slider">
              <Slider />
            </div>
          </div>
        </div>
        <div className="main-con-prod">
          <div className="main-content">
            <div className="filter">
              <div className="filter-box">
                <div className="filter-err-box">
                  <div className="filter-top">
                    <h3>
                      Filter {countProducts === 0 ? "No" : countProducts} items
                    </h3>
                    <div className="gen-cat">
                      <CloseIcon id="sharp" />
                      <label htmlFor="Gender">Gender: </label>
                      <select
                        name="gender"
                        id="select"
                        value={gender}
                        onChange={(e) =>
                          navigate(getFilterUrl({ gender: e.target.value }))
                        }
                      >
                        {genderselect.map((g, index) => (
                          <option key={index} className="gender-select">
                            {g.gender}
                          </option>
                        ))}
                      </select>
                      <br />
                      <CloseIcon id="sharp" />
                      <label htmlFor="Category">Category: </label>
                      <select
                        name="cat"
                        id="select"
                        value={category}
                        onChange={(e) =>
                          navigate(getFilterUrl({ category: e.target.value }))
                        }
                      >
                        {categories?.map((c, index) => (
                          <option
                            key={index}
                            className="cat-select"
                            value={c.category}
                          >
                            {c.category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="filter-med">
                    <div className="product-color">
                      <h4>Color</h4>
                      <ul className="ul-color">
                        {colors?.slice(0, 7)?.map((c, index) => (
                          <span
                            key={index}
                            value={color}
                            onClick={() => navigate(getFilterUrl(c))}
                          >
                            <li
                              onClick={() => setActiveColor(c)}
                              className={`${activeColor === c ? "active" : ""}`}
                            >
                              <img
                                src={c.color}
                                alt={c.color}
                                className="color_image_size"
                              />
                            </li>
                          </span>
                        ))}
                      </ul>
                    </div>
                    <div className="product-size">
                      <h4>Size</h4>
                      <div className="product-size-btn">
                        {productsize?.map((s, index) => (
                          <span
                            key={index}
                            onClick={() => setActiveSize(s)}
                            className={`${activeSize === s ? "size" : ""}`}
                          >
                            <button
                              key={s.value}
                              value={size}
                              onClick={() => navigate(getFilterUrl(s))}
                              className={`${activeSize === s ? "size" : ""}`}
                            >
                              {s.size}
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="price-range">
                      <h4>Price range</h4>
                      <div className="middle">
                        {/* <Slider
                          getAriaLabel={() => "price"}
                          value={price}
                          onChange={updateRange}
                          min={0}
                          max={200}
                          // getAriaValueText={valuetext}
                          className="slider"
                        /> */}

                        <FormControl variant="filled" size="small">
                          <InputLabel id="mui-price-select-label">
                            Price
                          </InputLabel>
                          <Select
                            labelId="mui-price-select-label"
                            id="mui-simple-select"
                            value={price}
                            MenuProps={MenuProps}
                            SelectDisplayProps={{
                              style: { paddingTop: 8, paddingBottom: 8 },
                            }}
                            onChange={(e) =>
                              navigate(getFilterUrl({ price: e.target.value }))
                            }
                          >
                            {prices?.map((p, index) => (
                              <MenuItem
                                key={index}
                                id="MuiMenuItem-root"
                                value={p.price}
                                disabled={p.disabled}
                              >
                                {p.priceSpan}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {/* <div className="amount">
                        <span className="lower">£{price[0]}</span>
                        <span className="higher">£{price[1]}</span>
                      </div> */}
                    </div>
                    <div className="brand">
                      <h4>Brand</h4>
                      <div className="select-brand">
                        <FormControl variant="filled" size="small">
                          <InputLabel id="mui-brand-select-label">
                            Brand
                          </InputLabel>
                          <Select
                            labelId="mui-simple-select-label"
                            id="mui-simple-select"
                            MenuProps={MenuProps}
                            SelectDisplayProps={{
                              style: { paddingTop: 8, paddingBottom: 8 },
                            }}
                            value={brand}
                            label={brand}
                            onChange={(e) =>
                              navigate(getFilterUrl({ brand: e.target.value }))
                            }
                          >
                            {brands?.map((b, index) => (
                              <MenuItem key={index} value={b.brand}>
                                {b.brand}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {/* <div className="check-list">
                        
                        <div className="brand-list">
                          {productbrand.map((b,1 id) => (
                            <form key={b.id}>
                              <input
                                type="checkbox"
                                id={b.brand}
                                value={b.checked}
                                onChange={(e) =>
                                  navigate(
                                    getFilterUrl({ brand: e.target.checked })
                                  )
                                }
                              />
                              <label htmlFor={b.brand}>{b.brand}</label>
                            </form>
                          ))}
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="apply-btn-clear">
                    <button onClick={() => navigate("/store")}>
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-main-product">
              {loading ? (
                <LoadingBox></LoadingBox>
              ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <>
                  <div className="main-product">
                    {products.length === 0 && (
                      <span className="product-not">
                        <MessageBox>No Product Found </MessageBox>
                      </span>
                    )}
                    {products?.map((product, index) => (
                      <div key={index}>
                        <StoreItems
                          product={product}
                          currencySign={currencySign}
                        ></StoreItems>
                      </div>
                    ))}
                  </div>
                  <div className="pagination">
                    <Pagination
                      page={page}
                      count={pages}
                      defaultPage={1}
                      //classes={{ ul: classes.ul }}
                      renderItem={(item) => (
                        <PaginationItem
                          className={`${
                            item.page !== page
                              ? "paginationItemStyle"
                              : "paginationItemStyle active"
                          }`}
                          component={Link}
                          to={`/store?page=${item.page}&query=${query}&category=${category}&gender=${gender}&color=${color}&size=${size}&price=${price}&brand=${brand}`}
                          {...item}
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="end_style_list">
          <FlashDeal simProducts={simProducts} currencySign={currencySign} />
        </div>

        <div className="lower-banner">
          <div className="lower-banner-con">
            <h1>Converse</h1>
            <p>
              Explore styles tough enough to <br />
              handle all your workouts
            </p>
            <Link to="/store?category=Shoes">
              <button>Show Brand</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="subscribe-offer">
        <p>Subscribe for shop news, updates and special offers</p>
        <form action="" onSubmit={submitHandler}>
          <div className="sub-response">
            <div className="spa-in">
              <MailOutlineIcon id="icon" className="sharp" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your e-mail here"
              />
            </div>
            <button>Subscribe</button>
          </div>
        </form>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Store;
