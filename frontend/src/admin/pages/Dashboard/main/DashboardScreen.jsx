import React, { useContext } from "react";
import Dashboard from "../sub/Dashboard";
import { Context } from "../../../../Context/Context";

function DashboardScreen() {
  const { state } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Dashboard currency={s.currency} currencySign={s.currencySign} />
        </div>
      ))}
    </>
  );
}

export default DashboardScreen;
