import axios from "axios";
import React, { useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../../common/footer/Footer";
import { getError } from "../../../Utilities/util/Utils";
import "../../password/styles.css";
import CloseIcon from "@mui/icons-material/Close";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false };
    case "SUBMIT_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

function PassReset(props) {
  const { closeModal } = props;
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const [email, setEmail] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required", { position: "bottom-center" });
    } else {
      dispatch({ type: "SUBMIT_REQUEST" });
      try {
        const { data } = await axios.post(`/api/users/password-token`, {
          email,
        });
        dispatch({ type: "SUBMIT_SUCCESS", payload: data });
        toast.success("Password reset email successfully sent to your email", {
          position: "bottom-center",
        });
      } catch (err) {
        dispatch({ type: "SUBMIT_FAIL" });
        toast.error(getError(err), { position: "bottom-center" });
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Password Reset</title>
      </Helmet>
      <div className="pass-reset">
        <div className="pass-reset-box">
          <div className="pass-reset-content">
            <div className="close">
              <Link to="/">
                <CloseIcon onClick={closeModal} className="close-reg" />
              </Link>
            </div>
            <h2 className="pass-reset-header">Password Reset Form</h2>
            <p>Enter email down below to reset your password</p>
            <form action="" onSubmit={submitHandler}>
              <div className="form-group">
                <input
                  className="input-box"
                  id="email"
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="pass-reset-btn">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default PassReset;
