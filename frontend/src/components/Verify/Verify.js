import React, { useContext, useReducer } from "react";
import Footer from "../Footer/Footer";
import "./verify.css";
import DoneIcon from "@mui/icons-material/Done";
import { Context } from "../../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "VERIFY_REQUEST":
      return { ...state, loading: true };
    case "VERIFY_SUCCESS":
      return { ...state, loading: false };
    case "VERIFY_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
function Verify(props) {
  const params = useParams();
  const { token, id: userId } = params;

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  //Verify Account
  const verificationHandler = async () => {
    dispatch({ type: "VERIFY_REQUEST" });
    try {
      const { data } = await axios.put(
        `/api/users/verify-account/${userId}`,
        { token },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "VERIFY_SUCCESS", payload: data.token });
    } catch (err) {
      dispatch({ type: "VERIFY_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    // localStorage.removeItem("!userInfo" && "cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <>
      <div className="verified">
        <div className="verified-box">
          <div className="verified-content">
            <DoneIcon className="verified-icon-done" />
            <h3 className="verified-header">Account Verified</h3>
            <p>
              Your account is now verified. Sign Out and Sign In to apply the
              changes
            </p>
            <button
              onClick={() => {
                verificationHandler();
                signoutHandler();
              }}
              className="verified-signout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default Verify;
