import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import "./SigninScreen.css";
import { Context } from "../../Context/Context";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../../components/Utilities/Utils";

function SigninScreen(props) {
  // const navigate = useNavigate();

  const { search } = useLocation();
  const redirectUnUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUnUrl ? redirectUnUrl : "/home";

  const { closeModal } = props;

  //SUBMIT FUNCTION
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(
        "http://localhost:5000/api/users/signin",
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // props.history?.push(redirect || "/home");
    } catch (err) {
      toast.error(getError(err), {
        position: "bottom-center",
        limit: 1,
      });
      console.log(err);
    }
  };

  // useEffect(() => {
  //   if (userInfo) {
  //     props.history?.push(redirect);
  //   }
  // }, [props.history, redirect, userInfo]);
  return (
    <div className="sign-in">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <div className="singin-header">
        <form onSubmit={submitHandler}>
          <div className="form-header">
            <h2>Sign In</h2>
          </div>

          <div className="inner-form">
            <div className="form-group">
              <input
                className="input-box"
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="input-box"
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="check-sign">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  placeholder="Email"
                  id="signin"
                  required
                />
                <label htmlFor="signin">Remember</label>
              </div>
              <div className="form-button">
                <button>Sign In</button>
              </div>
            </div>
            <div className="form-footer">
              <div className="f-pass">
                <Link to="#">
                  <span>Forgot password</span>
                </Link>
              </div>
              <div className="o-account">
                <Link to={`/signup?redirect=${redirect}`}>
                  <span>Have an account</span>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SigninScreen;
