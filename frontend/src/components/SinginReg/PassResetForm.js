import axios from "axios";
import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

import Footer from "../Footer/Footer";
import { getError } from "../Utilities/Utils";
import "./passreset.css";

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

function PassResetForm(props) {
  const params = useParams();
  const { token, id: userId } = params;

  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  const [password, setPassword] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password field is required", { position: "bottom-center" });
    } else {
      if (password.length < 8) {
        toast.error("Minimum of 8 characters is required ", {
          position: "bottom-center",
        });
      } else {
        dispatch({ type: "SUBMIT_REQUEST" });
        try {
          const { data } = await axios.put(
            `/api/users/${userId}/reset-password`,
            {
              password,
              token,
            }
          );
          dispatch({ type: "SUBMIT_SUCCESS", payload: data });
          toast.success(
            "Password reset  successfully, you will be redirected to sign screen in 3 seconds",
            {
              position: "bottom-center",
            }
          );
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
        } catch (err) {
          dispatch({ type: "SUBMIT_FAIL" });
          toast.error(getError(err), { position: "bottom-center" });
        }
      }
    }
  };

  //TOGGLE PASSWOD VIEW
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
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
            <h2 className="pass-reset-header">Password Reset Form</h2>
            <p>Enter new password down below </p>
            <form action="" onSubmit={submitHandler}>
              <div className="form-group">
                <input
                  className="input-box"
                  id="password"
                  type={type}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span onClick={handleToggle}>
                  <Icon icon={icon} size={25} className="eye-icon" />
                </span>
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

export default PassResetForm;
