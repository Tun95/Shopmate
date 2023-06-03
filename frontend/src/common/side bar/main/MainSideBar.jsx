import React, { useContext, useState } from "react";
import SideBar from "../sub_side/SideBar";
import { Context } from "../../../Context/Context";
function MainSideBar({ openSideBar, closeSideBar, showSideBar }) {
  const { state } = useContext(Context);
  const { settings } = state;

  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <SideBar
            openSideBar={openSideBar}
            closeSideBar={closeSideBar}
            currency={s.currency}
            currencySign={s.currencySign}
            showSideBar={showSideBar}
          />
        </div>
      ))}
    </>
  );
}

export default MainSideBar;
