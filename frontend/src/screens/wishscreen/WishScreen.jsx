import React, { useContext } from "react";
import Wishlist from "../../components/Wish/Wishlist";
import { Context } from "../../Context/Context";

function WishScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Wishlist currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default WishScreen;
