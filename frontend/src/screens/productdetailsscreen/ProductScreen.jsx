import React, { useContext } from "react";
import ProductPage from "../../components/Product-Page/ProductPage";
import { Context } from "../../Context/Context";

function ProductScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <ProductPage currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default ProductScreen;
