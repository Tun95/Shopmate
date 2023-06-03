import React, { useContext } from "react";
import OrderDetails from "../../../components/orders/details/OrderDetails";
import { Context } from "../../../Context/Context";

function OrderDetailScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <OrderDetails webname={s.webname} currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default OrderDetailScreen;
