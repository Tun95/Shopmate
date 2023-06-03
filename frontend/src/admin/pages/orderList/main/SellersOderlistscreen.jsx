import React, { useContext } from "react";
import { Context } from "../../../../Context/Context";
import SellerOrders from "../sub/SellerOrder";

function SellersOderlistscreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <SellerOrders currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default SellersOderlistscreen;
