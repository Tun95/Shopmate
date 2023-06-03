import React, { useContext } from "react";
import { Context } from "../../../../Context/Context";
import OrderList from "../sub/OrderList";

function OrderlistScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <OrderList currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default OrderlistScreen;
