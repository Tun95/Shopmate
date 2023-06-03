import React, { useContext } from "react";
import NavBarSR from "../infonav/NavBarSR";
import { Context } from "../../../Context/Context";

function MainInfoNav() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <NavBarSR currency={s.currency} />
        </div>
      ))}
    </>
  );
}

export default MainInfoNav;
