import React, { useContext } from "react";
import Store from "../../components/Store/store/Store";
import { Context } from "../../Context/Context";

function StoreScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Store currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default StoreScreen;
