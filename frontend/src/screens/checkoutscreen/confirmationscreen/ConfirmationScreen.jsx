import React, { useContext } from "react";
import Confirmation from "../../../components/checkout step/confirmation/Confirmation";
import { Context } from "../../../Context/Context";

function ConfirmationScreen() {
  const { state, dispatch } = useContext(Context);
  const { settings } = state;
  return (
    <>
      {settings?.map((s, index) => (
        <div key={index}>
          <Confirmation
            express={s.express}
            expressCharges={s.expressCharges}
            standardCharges={s.standardCharges}
            tax={s.tax}
            currencySign={s.currencySign}
          />
        </div>
      ))}
    </>
  );
}

export default ConfirmationScreen;
