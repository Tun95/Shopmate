import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";
import { getError } from "../Utilities/Utils";
import "./RegisterScreen.css";
import CloseIcon from "@mui/icons-material/Close";
import Footer from "../Footer/Footer";

function RegisterScreen(props) {
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectUnUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUnUrl ? redirectUnUrl : "/";
  const { closeModal } = props;

  //SUBMIT FUNCTION
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("name, email or password field is required", {
        position: "bottom-center",
      });
    } else {
      if (password !== confirmPassword) {
        toast.error("Password do not match", { position: "bottom-center" });
        return;
      }

      try {
        const { data } = await Axios.post("/api/users/signup", {
          name,
          email,
          password,
        });
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate(redirect || "/");
        toast.error("sign up successfully", { position: "bottom-center" });
      } catch (err) {
        toast.error(getError(err), {
          position: "bottom-center",
          limit: 1,
        });
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <div className="reg-in">
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <div className="reg-header">
          <form onSubmit={submitHandler}>
            <div className="close">
              <Link to="/">
                <CloseIcon onClick={closeModal} className="close-reg" />
              </Link>
            </div>
            <div className="reg-form-header">
              <h2>Sign Up</h2>
            </div>

            <div className="reg-inner-form">
              <div className="reg-form-group">
                <input
                  className="reg-input-box"
                  id="name"
                  type="name"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="reg-form-group">
                <input
                  className="reg-input-box"
                  id="email"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="reg-form-group">
                <input
                  className="reg-input-box"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="reg-form-group">
                <input
                  className="reg-input-box"
                  id="password"
                  type="password"
                  placeholder="Re-type password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="reg-check-sign">
                <div className="reg-form-button">
                  <button>Sign Up</button>
                </div>
              </div>
              <div className="reg-form-footer">
                <div className="reg-f-pass">
                  <span>Already a member?</span>
                </div>
                <div className="reg-sigin">
                  <Link to={`/signin?redirect=${redirect}`}>
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default RegisterScreen;
