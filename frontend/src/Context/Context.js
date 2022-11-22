import { useState } from "react";
import { useReducer } from "react";
import { createContext } from "react";

export const Context = createContext();

//CartItems Fetching
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},

    paymentMethod: localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : {},

    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
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

  //Filter Product
  const [filter, setFilter] = useState({});

  //Shipping Type
  let Express = "Express shipping:(£28, 1-2 business days)";
  let Standard = "Standard shipping:(free, 2-3 business days)";

  const value = {
    state,
    dispatch,
    filter,
    setFilter,
    Express,
    Standard,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
