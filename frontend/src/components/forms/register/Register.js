import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../../Context/Context";
import { getError } from "../../Utilities/util/Utils";
import "./styles.css";
import CloseIcon from "@mui/icons-material/Close";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

import Footer from "../../../common/footer/Footer";

function Register(props) {
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
      if (password.length < 8) {
        toast.error("Minimum of 8 characters is required for password", {
          position: "bottom-center",
        });
      } else {
        if (password !== confirmPassword) {
          toast.error("Password do not match", { position: "bottom-center" });
          return;
        }

        try {
          const { data } = await Axios.post(`/api/users/signup`, {
            name,
            email,
            password,
          });
          ctxDispatch({ type: "USER_SIGNIN", payload: data });
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate(redirect || "/");
          toast.success("Sign up successfully", { position: "bottom-center" });
        } catch (err) {
          toast.error(getError(err), {
            position: "bottom-center",
            limit: 1,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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

  //TOGGLE PASSWOD VIEW
  const [typeCom, setTypeCom] = useState("password");
  const [iconCom, setIconCom] = useState(eyeOff);

  const handleComToggle = () => {
    if (typeCom === "password") {
      setIconCom(eye);
      setTypeCom("text");
    } else {
      setIconCom(eyeOff);
      setTypeCom("password");
    }
  };

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
                  type={type}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span onClick={handleToggle}>
                  <Icon icon={icon} size={25} className="eye-icon" />
                </span>
              </div>
              <div className="reg-form-group">
                <input
                  className="reg-input-box"
                  id="password"
                  type={typeCom}
                  placeholder="Re-type password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span onClick={handleComToggle}>
                  <Icon icon={iconCom} size={25} className="eye-icon" />
                </span>
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

export default Register;
