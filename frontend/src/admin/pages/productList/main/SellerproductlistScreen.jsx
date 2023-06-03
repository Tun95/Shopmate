import React, { useContext } from "react";
import { Context } from "../../../../Context/Context";
import SellerProductlist from "../sub/SellerProductlist";

function SellerproductlistScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <SellerProductlist
            webname={s.webname}
            currencySign={s.currencySign}
          />
        </div>
      ))}
    </>
  );
}

export default SellerproductlistScreen;
