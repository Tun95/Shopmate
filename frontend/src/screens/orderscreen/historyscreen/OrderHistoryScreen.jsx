import React, { useContext } from "react";
import OrderHistory from "../../../components/orders/history/OrderHistory";
import { Context } from "../../../Context/Context";

function OrderHistoryScreen() {
  const { state, dispatch } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <OrderHistory currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default OrderHistoryScreen;
