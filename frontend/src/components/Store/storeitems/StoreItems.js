import React, { useContext, useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../../Context/Context";
import { toast } from "react-toastify";

function StoreItems(props) {
  const { product, currencySign } = props;
  //Color Style
  const [color, setColor] = useState(false);

  //Size state
  const [size, setSize] = useState(false);

  //Product Quantity
  const [quantity, setQuantity] = useState(1);

  //ADD TO CART
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { settings } = state;
  const addToCartHandler = async (item) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    // if (cartItems.length > 0 && data.seller._id !== cartItems[0].seller._id) {
    //   dispatch({
    //     type: "CART_ADD_ITEM_FAIL",
    //     payload: `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
    //   });
    //   toast.error(
    //     `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
    //     {
    //       position: "bottom-center",
    //     }
    //   );
    // } else {
    if (data.countInStock < quantity) {
      toast.error("Sorry, Product stock limit reached or out of stock", {
        position: "bottom-center",
      });
      return;
    } else {
      toast.success(`${item.name} is successfully added to cart`, {
        position: "bottom-center",
      });
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        discount: data.discount,
        seller: data.seller,
        sellerName: item?.seller?.seller?.name,
        quantity,
        size,
        color,
      },
    });
  };

  return (
    <>
      <div className="product-list_product">
        <div className="prod-design_prod">
          <div className="top-list-product">
            {product.discount > 0 && (
              <div className="item-discount">{product.discount}%</div>
            )}
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
              {product.discount > 0 ? (
                <>
                  {settings?.map((s, index) => (
                    <div key={index}>
                      <div className="price">
                        {s.currencySign}
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        )?.toFixed(2)}
                      </div>
                      <s className="price-discount">
                        {s.currencySign}
                        {product.price?.toFixed(2)}
                      </s>
                    </div>
                  ))}
                </>
              ) : (
                <div className="price">
                  {currencySign}
                  {product.price?.toFixed(2)}
                </div>
              )}
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
                  Add To Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StoreItems;
