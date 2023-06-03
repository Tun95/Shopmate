import React, { useContext } from "react";
import { Context } from "../../../../../../Context/Context";
import { PriceUpdate } from "../../sub/filterUpdate";

function UpdatePriceScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <PriceUpdate currency={s.currency} currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default UpdatePriceScreen;
