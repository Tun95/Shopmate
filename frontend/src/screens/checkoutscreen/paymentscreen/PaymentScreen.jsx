import React, { useContext } from "react";
import { Context } from "../../../Context/Context";
import Payment from "../../../components/checkout step/payment/Payment";

function PaymentScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Payment currency={s.currency} currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default PaymentScreen;
