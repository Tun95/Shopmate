import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../../Context/Context";

export default function SellerRoute({ children }) {
  const { state } = useContext(Context);

  const { userInfo } = state;
  return userInfo && userInfo.isSeller ? children : <Navigate to="/signin" />;
}
