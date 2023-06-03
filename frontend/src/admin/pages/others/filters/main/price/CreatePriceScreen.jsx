import React, { useContext } from "react";
import { Context } from "../../../../../../Context/Context";
import { Price } from "../../sub/filterCreate";

function CreatePriceScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Price currency={s.currency} currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default CreatePriceScreen;
