import axios from "axios";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import { getError } from "../components/Utilities/util/Utils";
import { request } from "../base_url/Base_URL";

export const Context = createContext();

//CartItems Fetching
const initialState = {
  loading: true,
  error: "",

  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},

    paymentMethod: localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : "",

    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    //FETCH SETTINGS
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, settings: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    //FETCH PRICE
    case "FETCH_PRICE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PRICE_SUCCESS":
      return { ...state, loading: false, prices: action.payload };
    case "FETCH_PRICE_FAIL":
      return { ...state, loading: false, error: action.payload };

    //FETCH COLOR
    case "FETCH_COLOR_REQUEST":
      return { ...state, loadingColor: true };
    case "FETCH_COLOR_SUCCESS":
      return { ...state, loadingColo: false, colors: action.payload };
    case "FETCH_COLOR_FAIL":
      return { ...state, loadingColo: false, errorColor: action.payload };

    //FETCH BANNER
    case "FETCH_BANNER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_BANNER_SUCCESS":
      return { ...state, loading: false, banners: action.payload };
    case "FETCH_BANNER_FAIL":
      return { ...state, loading: false, error: action.payload };

    //ADD TO CART
    case "CART_ADD_ITEM":
      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    //REMOVE FROM CART
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, error: "", cart: { ...state.cart, cartItems } };
    }

    //CART CLEAR
    case "CART_CLEAR":
      return { ...state, error: "", cart: { ...state.cart, cartItems: [] } };

    //CART_ADD_ITEM_FAIL
    case "CART_ADD_ITEM_FAIL":
      return { ...state, error: action.payload };

    //SIGN IN & SIGN OUT
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };

    //SHIPPING
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };

    //PAYMENT METHOD
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    default:
      return state;
  }
}

export function ContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  //==============
  //FETCH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/settings`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    fetchData();
  }, [dispatch]);

  //FETCH ALL PRICE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${request}/api/price`);
        dispatch({ type: "FETCH_PRICE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_PRICE_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  //FETCH ALL COLOR
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${request}/api/color`);
        console.log(data);
        dispatch({ type: "FETCH_COLOR_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_COLOR_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  //FETCH ALL BANNER
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${request}/api/banner`);
        dispatch({ type: "FETCH_BANNER_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_BANNER_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  //Filter Product
  const [filter, setFilter] = useState({});

  const value = {
    state,
    dispatch,
    filter,
    setFilter,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
