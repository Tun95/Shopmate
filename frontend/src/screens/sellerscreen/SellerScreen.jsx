import React, { useContext } from "react";
import { Context } from "../../Context/Context";
import Sellers from "../../components/SellersProduct/Sellers";

function SellerScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Sellers currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default SellerScreen;
