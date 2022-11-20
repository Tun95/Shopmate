import React, { useReducer, useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Store.css";
import data from "../../data/data.json";
import StoreItems from "./StoreItems";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SimilarProduct from "./SimilarProduct";
import { Helmet } from "react-helmet-async";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import MessageBox from "../Utilities/MessageBox";
import LoadingBox from "../Utilities/LoadingBox";
import { getError } from "../Utilities/Utils";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";

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
function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 10;

function Store(props) {
  const {
    prices,
    categories,
    genderselect,
    productsize,
    productcolor,
    productbrand,
  } = data;

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
  const page = parseInt(sp.get("page") || 1);

  const [
    { loading, error, products, simProducts, pages, countProducts },
    dispatch,
  ] = useReducer(reducer, {
    products: [],
    simProducts: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/products/store?page=${page}&query=${query}&category=${category}&gender=${gender}&color=${color}&size=${size}&price=${price}&brand=${brand}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [category, brand, color, size, gender, page, price, query]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterGender = filter.gender || gender;
    const filterColor = filter.color || color;
    const filterSize = filter.size || size;
    const filterPrice = filter.price || price;
    const filterBrand = filter.brand || brand;
    return `/store?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&gender=${filterGender}&color=${filterColor}&size=${filterSize}&price=${filterPrice}&brand=${filterBrand}`;
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

  // const [value, setValue] = useState([10, 100]);
  // const updateRange = (e, price) => {
  //   setValue(price);
  //   console.log(price);
  // };

  const handlePageChange = (e, page) => {
    navigate(getFilterUrl({ page: e.target.textContent }));
    // window.scroll(0, 0);
    // const from = (page - 1) * pages;
    // const to = (page - 1) * pages + pages;
    // setPagination({ ...pagination, from: from, to: to });
  };
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
        const { data } = axios.post("/api/message/subscribe", {
          email,
        });
        dispatch({ type: "POST_SUCCESS", payload: data });

        toast.success("You have successfully subscribe to our newsletter", {
          position: "bottom-center",
        });
      } catch {
        dispatch({ type: "POST_FAIL" });
        toast.error(getError(error.message));
      }
    }
  };

  return (
    <div className="content-cloth">
      <Helmet>
        <title>Shopmore Store</title>
      </Helmet>

      <div className="container">
        <div className="banner-container">
          {/* <img src={banner2} /> */}
          <h1>Mens wear</h1>
          <div className="banner-list">
            <div className="list-1">
              <ul>
                <Link to="">
                  <li>Accessories</li>
                </Link>
                <Link to="">
                  <li>ASOS Basic Tops</li>
                </Link>{" "}
                <Link to="">
                  <li>Bags</li>
                </Link>{" "}
                <Link to="">
                  <li>Caps &amp; Hats</li>
                </Link>{" "}
                <Link to="">
                  <li>Gifts</li>
                </Link>{" "}
                <Link to="">
                  <li>Grooming</li>
                </Link>
              </ul>
            </div>
            <div className="list-2">
              <ul>
                <Link to="">
                  <li>Hoodies &amp; Sweatshirts</li>
                </Link>
                <Link to="">
                  <li>Jackets &amp; Coats</li>
                </Link>{" "}
                <Link to="">
                  <li>Jeans</li>
                </Link>{" "}
                <Link to="">
                  <li>Jewellery</li>
                </Link>{" "}
                <Link to="">
                  <li>Joggers</li>
                </Link>{" "}
                <Link to="">
                  <li>Jumpers &amp; Cardigans</li>
                </Link>
              </ul>
            </div>
            <div className="list-3">
              <ul>
                <Link to="">
                  <li>Leather Jackets</li>
                </Link>
                <Link to="">
                  <li>Long Sleeve T-Shirts</li>
                </Link>{" "}
                <Link to="">
                  <li>Loungewear</li>
                </Link>{" "}
                <Link to="">
                  <li>Oversized &amp; Longline</li>
                </Link>{" "}
                <Link to="">
                  <li>Polo Shirts</li>
                </Link>{" "}
                <Link to="">
                  <li>Shirts</li>
                </Link>
              </ul>
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
                      <span className="material-symbols-sharp" id="sharp">
                        close
                      </span>
                      <label htmlFor="Gender">Gender: </label>
                      <select
                        name="gender"
                        id="select"
                        value={gender}
                        onChange={(e) =>
                          navigate(getFilterUrl({ gender: e.target.value }))
                        }
                      >
                        {genderselect.map((g) => (
                          <option key={g.id} className="gender-select">
                            {g.gender}
                          </option>
                        ))}
                      </select>
                      <br />
                      <span className="material-symbols-sharp" id="sharp">
                        close
                      </span>
                      <label htmlFor="Category">Category: </label>
                      <select
                        name="cat"
                        id="select"
                        value={category}
                        onChange={(e) =>
                          navigate(getFilterUrl({ category: e.target.value }))
                        }
                      >
                        {categories.map((category) => (
                          <option
                            key={category.id}
                            className="cat-select"
                            value={category.cat}
                          >
                            {category.cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="filter-med">
                    <div className="product-color">
                      <h4>Color</h4>
                      <ul className="ul-color">
                        {productcolor.map((c) => (
                          <span
                            value={color}
                            onClick={() => navigate(getFilterUrl(c))}
                          >
                            <li
                              key={c}
                              onClick={() => setActiveColor(c)}
                              className={`${activeColor === c ? "active" : ""}`}
                            >
                              <i className={c.color}></i>
                            </li>
                          </span>
                        ))}
                      </ul>
                    </div>
                    <div className="product-size">
                      <h4>Size</h4>
                      <div className="product-size-btn">
                        {productsize.map((s, id) => (
                          <span
                            key={s.value}
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
                          value={value}
                          onChange={handleChange}
                          min={0}
                          max={200}
                          getAriaValueText={valuetext}
                          className="slider"
                        /> */}
                        {/* <Slider
                          value={price}
                          onChange={updateRange}
                           marks={prices}
                        /> */}
                        <FormControl>
                          <InputLabel id="mui-price-select-label">
                            Price
                          </InputLabel>
                          <Select
                            labelId="mui-price-select-label"
                            id="mui-simple-select"
                            value={price}
                            MenuProps={MenuProps}
                            onChange={(e) =>
                              navigate(getFilterUrl({ price: e.target.value }))
                            }
                          >
                            {prices.map((p) => (
                              <MenuItem
                                value={p.value}
                                disabled={p.disabled}
                                selected={p.label[1]}
                              >
                                {p.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {/* <div className="amount">
                        <span className="lower">£{value[0]}</span>
                        <span className="higher">£{value[1]}</span>
                      </div> */}
                    </div>
                    <div className="brand">
                      <h4>Brand</h4>
                      <div className="select-brand">
                        <FormControl>
                          <InputLabel id="mui-brand-select-label">
                            Brand
                          </InputLabel>
                          <Select
                            labelId="mui-simple-select-label"
                            id="mui-simple-select"
                            MenuProps={MenuProps}
                            value={brand}
                            label={brand}
                            onChange={(e) =>
                              navigate(getFilterUrl({ brand: e.target.value }))
                            }
                          >
                            {productbrand.map((b) => (
                              <MenuItem value={b.brand}>{b.brand}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {/* <div className="check-list">
                        
                        <div className="brand-list">
                          {productbrand.map((b, id) => (
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
                    <button>Apply</button>

                    {query !== "all" ||
                    category !== "all" ||
                    gender !== "all" ||
                    size !== "all" ||
                    color !== "all" ||
                    price !== "all" ||
                    brand !== "all" ? (
                      <div
                        className="close-btn-clear"
                        onClick={() => navigate("/store")}
                      >
                        <span className="material-symbols-sharp" id="sharp">
                          close
                        </span>
                        <div className="clear-all">Clear All</div>
                      </div>
                    ) : (
                      <div className="close-btn-clear">
                        <span className="material-symbols-sharp" id="sharp">
                          close
                        </span>
                        <div className="clear-all">Clear All</div>
                      </div>
                    )}
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
                    {products?.map((product) => (
                      <div key={product._id}>
                        <StoreItems product={product}></StoreItems>
                      </div>
                    ))}
                  </div>
                  <div className="pagination">
                    {/* <div className="productlist-page"></div> */}
                    {/* {[...Array(pages).keys()].map((x) => (
                        <Link
                          className={
                            x + 1 === Number(page) ? "btn text-bold" : "btn"
                          }
                          key={x + 1}
                          to={`/store?page=${x + 1}`}
                        >
                          {x + 1}
                        </Link>
                      ))} */}
                    <Pagination
                      page={page}
                      count={pages}
                      defaultPage={1}
                      // siblingCount={3}
                      // boundaryCount={2}
                      color="secondary"
                      renderItem={(item) => (
                        <PaginationItem
                          component={Link}
                          to={`/store?page=${item.page}&query=${query}&category=${category}&gender=${gender}&color=${color}&size=${size}&price=${price}&brand=${brand}`}
                          {...item}
                          //{`/inbox${item.page === 1 ? '' : `?page=${item.page}`}`}
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="similar-prod-store">
          <div className="end-list">
            {simProducts.slice(0, 10).map((sim) => (
              <div key={sim.id} className="endlist">
                <SimilarProduct sim={sim} />
              </div>
            ))}
          </div>
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
              <span className="material-symbols-sharp" id="icon">
                mail
              </span>
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
