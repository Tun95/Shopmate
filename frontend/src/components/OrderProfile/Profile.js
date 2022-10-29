import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Profile.css";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";
import axios from "axios";
import LoadingBox from "../Utilities/LoadingBox";
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

function Profile() {
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const [{ loadingUpdate, user }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState(userInfo.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    userInfo.confirmPassword || ""
  );
  const [sellerName, setSellerName] = useState(userInfo.sellerName || "");
  const [sellerLogo, setSellerLogo] = useState(userInfo.sellerLogo || "");
  const [sellerDescription, setSellerDescription] = useState(
    userInfo.sellerDescription || ""
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({
        type: "USER_SIGNIN",
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully", { position: "bottom-center" });
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  return (
    <div className="profile">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div className="profile-styles">
        <div className="profile-seller">
          <div className="profile-in">
            <div className="profile-header">
              <form onSubmit={submitHandler}>
                <div className="profile-form-header">
                  <h1>User Profile</h1>
                </div>

                <div className="profile-inner-form">
                  <div className="profile-form-group">
                    <label htmlFor="name">Name </label>
                    <input
                      className="profile-input-box"
                      id="name"
                      type="name"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label htmlFor="email">Email </label>
                    <input
                      className="profile-input-box"
                      id="email"
                      type="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="password">Password </label>
                    <input
                      className="profile-input-box"
                      id="password"
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="profile-form-group">
                    <label htmlFor="c-password">Confirm password </label>
                    <input
                      className="profile-input-box"
                      id="c-password"
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {userInfo.isSeller && (
                    <>
                      <h1 className="seller-header">Seller Profile</h1>

                      <div className="seller-component">
                        <div className="profile-form-group">
                          <label htmlFor="sellername">Seller Name </label>
                          <input
                            className="profile-input-box"
                            id="sellername"
                            type="text"
                            placeholder="Seller Name"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                          />
                        </div>

                        <div className="profile-form-group">
                          <label htmlFor="">Seller Logo </label>
                          <input
                            className="profile-input-box seller-logo"
                            id="sellerlogo"
                            type="file"
                            value={sellerLogo}
                            onChange={(e) => setSellerLogo(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-group">
                          <label htmlFor="sellerdesc">
                            Seller Description{" "}
                          </label>
                          <textarea
                            name="message"
                            id="sellerdesc"
                            cols="30"
                            rows="10"
                            className="textarea"
                            value={sellerDescription}
                            onChange={(e) =>
                              setSellerDescription(e.target.value)
                            }
                            placeholder="Enter Your Description"
                          ></textarea>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="profile-check-sign">
                    <div className="profile-form-button">
                      {loadingUpdate && <LoadingBox></LoadingBox>}
                      <button>Update</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
