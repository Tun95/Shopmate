import React, { useContext, useEffect, useState } from "react";
import "./StoreItems.css";
import { Link } from "react-router-dom";
import axios from "axios";
import data from "../../data/data.json";
import { Context } from "../../Context/Context";

function StoreItems(props) {
  const { product, onAdd, onRemove, item, removeItem } = props;
  const { categories } = data;
  //Color Style
  const [color, setColor] = useState(false);

  //Size state
  const [size, setSize] = useState(false);

  //Product Quantity
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  //ADD TO CART
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { cart } = state;
  const addToCartHandler = async (item) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, seller: data.seller, quantity, size, color },
    });
  };

  return (
    <div>
      <div className="product-list">
        <div className="prod-design">
          <div className="top-list-product">
            <Link to={`/product/${product.slug}`}>
              {" "}
              <img
                src={product.image}
                className="product-img"
                alt={product.name}
              />
            </Link>
            <div className="p-name">
              <Link to={`/product/${product.slug}`}>
                <h4>{product.name}</h4>
              </Link>
              <div className="price">£{product.price}</div>
            </div>

            {/* <Link to={`/sellers-screen/${product.seller._id}`}>
              {product.seller.seller.name}
            </Link> */}

            {product.countInStock === 0 ? (
              <button className="out-stock" variant="light" disabled>
                Out of stock
              </button>
            ) : (
              <div className="btn-view">
                <button
                  onClick={() => addToCartHandler(product)}
                  className="buy-btn"
                >
                  Buy now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreItems;
