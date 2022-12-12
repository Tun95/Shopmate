import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Profile.css";
import { Context } from "../../Context/Context";
import { toast } from "react-toastify";
import { getError } from "../Utilities/Utils";
import axios from "axios";
import LoadingBox from "../Utilities/LoadingBox";
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import person from "../images/person.png";
import MessageBox from "../Utilities/MessageBox";
import PublishIcon from "@mui/icons-material/Publish";

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
  const params = useParams();
  const { id: userId } = params;
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, user }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      loadingUpdate: false,
    }
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setCountry(data.country);
        setImage(data.image);

        setSellerName(data?.seller?.name);
        setSellerLogo(data?.seller?.logo);
        setSellerDescription(data?.seller?.description);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    console.log(user);
  }, [user, userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          phone,
          address,
          image,
          country,
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

  //PROFILE PICTURE
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //SELLER PROFILE PICTURE
  const uploadSellerFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });
      setSellerLogo(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };
  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
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
                        <img src={image ? image : person} alt="" />

                        <input
                          className="profile-input-box"
                          id="file"
                          type="file"
                          onChange={uploadFileHandler}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="file">
                          <PublishIcon
                            className="userUpdateIcon"
                            onChange={uploadFileHandler}
                          />
                        </label>
                        <span>
                          {!userInfo.isAccountVerified ? (
                            <span className="unverified-account">
                              unverified account
                            </span>
                          ) : (
                            <span className="verified-account">
                              verified account
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="profile-inner-form">
                        <div className="profile-form-group">
                          <label htmlFor="name">Name </label>
                          <input
                            className="profile-input-box"
                            id="name"
                            type="name"
                            placeholder="Name"
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
                            disabled={userInfo?.isAdmin}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-group">
                          <label htmlFor="phone">Phone </label>
                          <input
                            className="profile-input-box"
                            id="phone"
                            type="phone"
                            value={phone}
                            placeholder="phone"
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-group">
                          <label htmlFor="address">Address </label>
                          <input
                            className="profile-input-box"
                            id="address"
                            type="address"
                            value={address}
                            placeholder="address"
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-group">
                          <label htmlFor="country">Country </label>
                          <input
                            className="profile-input-box"
                            id="country"
                            type="country"
                            value={country}
                            placeholder="country"
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>

                        <div className="profile-form-group">
                          <label htmlFor="password">Password </label>
                          <input
                            className="profile-input-box"
                            id="password"
                            type="password"
                            value={password}
                            disabled={userInfo?.isAdmin}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-group">
                          <label htmlFor="c-password">Confirm password </label>
                          <input
                            className="profile-input-box"
                            id="c-password"
                            type="password"
                            value={confirmPassword}
                            disabled={userInfo?.isAdmin}
                            placeholder="Confirm password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                  onChange={(e) =>
                                    setSellerName(e.target.value)
                                  }
                                />
                              </div>

                              <div className="prof-seller-logo">
                                <div className="profile-form-group">
                                  <label htmlFor="sellerlogo">
                                    Seller Logo{" "}
                                  </label>
                                  <input
                                    className="profile-input-box"
                                    id="sellerlogo"
                                    type="file"
                                    onChange={uploadSellerFileHandler}
                                    style={{ display: "none" }}
                                  />
                                </div>
                                <div className="seller-flex">
                                  <img
                                    src={sellerLogo ? sellerLogo : person}
                                    alt=""
                                  />
                                  <label htmlFor="sellerlogo">
                                    <PublishIcon
                                      className="userUpdateIcon"
                                      onChange={uploadSellerFileHandler}
                                    />
                                  </label>
                                </div>
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
                                  value={sellerDescription || ""}
                                  onChange={(e) =>
                                    setSellerDescription(e.target.value)
                                  }
                                  placeholder="Enter Your Description"
                                ></textarea>
                              </div>
                            </div>
                          </>
                        )}
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                        <div className="profile-check-sign">
                          <div className="profile-form-button">
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
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
