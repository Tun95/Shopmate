import React, { useContext, useReducer } from "react";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import "./alert.css";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function Alert() {
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  const verificationHandler = async () => {
    dispatch({ type: "CREATE_REQUEST" });
    try {
      const { data } = await axios.post(
        "/api/users/verification-token",
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Verification email sent successfully ", {
        position: "bottom-center",
      });
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  return (
    <div className="alert-top-bar">
      <div className="alert-bar">
        <div className="yellow-bar"></div>
        <div className="alert-bar-content">
          <ReportProblemOutlinedIcon className="alert-top-icon" />
          <span className="alert-text">Your account is not verified,</span>
          <Link>
            <span onClick={verificationHandler} className="alert-text-link">
              Click this link to verify
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Alert;
