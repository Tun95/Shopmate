import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import "./Profile.scss";
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
import JoditEditor from "jodit-react";

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
  const editor = useRef(null);

  const params = useParams();
  const { id: userId } = params;
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error,  user }, dispatch] = useReducer(
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
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setCountry(data.country);
        setImage(data.image);

        setSellerName(data?.seller?.name);
        setSellerLogo(data?.seller?.logo);
        setSellerDescription(data?.seller?.description);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    console.log(userId);
  }, [userId, userInfo]);

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
              <title>Profile</title>
            </Helmet>
            <div className="profile-styles">
              <div className="profile_seller">
                <div className="profile_box">
                  <div className="profile-box">
                    <form onSubmit={submitHandler} className="profile_form">
                      <div className="profile-form-header">
                        <h1>Profile</h1>
                        <div className="form_header">
                          <div className="user_image">
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
                          </div>
                          <div className="user_details">
                            <div className="user_detail_list">
                              <label>Name:</label>
                              <h4>{user?.name}</h4>
                            </div>
                            <div className="user_detail_list">
                              <label>Email:</label>
                              <h4>{user?.email}</h4>
                            </div>
                            <div className="user_detail_list">
                              <label>Address:</label>
                              <h4>{user?.address}</h4>
                            </div>
                            <div className="user_detail_list">
                              <label>Country:</label>
                              <h4>{user?.country}</h4>
                            </div>
                            <div className="user_detail_list">
                              <label>Status:</label>
                              {!userInfo.isAccountVerified ? (
                                <span className="unverified-account">
                                  unverified account
                                </span>
                              ) : (
                                <span className="verified-account">
                                  verified account
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile_inner_form">
                        <div className="profile_user_form">
                          <div className="profile_form_group">
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
                          <div className="profile_form_group">
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
                          <div className="profile_form_group">
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
                          <div className="profile_form_group">
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
                          <div className="profile_form_group">
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

                          <div className="profile_form_group">
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
                          <div className="profile_form_group">
                            <label htmlFor="c-password">
                              Confirm password{" "}
                            </label>
                            <input
                              className="profile-input-box"
                              id="c-password"
                              type="password"
                              value={confirmPassword}
                              disabled={userInfo?.isAdmin}
                              placeholder="Confirm password"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {userInfo.isSeller && (
                          <>
                            <div className="seller_component">
                              <h3 className="seller_header">
                                Seller Profile Info:
                              </h3>
                              <div className="prof-seller-logo">
                                <div className="profile-form-group">
                                  <label htmlFor="sellerlogo">
                                    Seller Logo:{" "}
                                  </label>
                                  <input
                                    className="profile-input-box"
                                    id="sellerlogo"
                                    type="file"
                                    onChange={uploadSellerFileHandler}
                                    style={{ display: "none" }}
                                  />
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
                              </div>
                              <div className="profile-form-group seller_name">
                                <label htmlFor="sellername">
                                  Seller Name:{" "}
                                </label>
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
                              <div className="profile-form-group">
                                <label htmlFor="sellerdesc">Bio:</label>
                                <div className="form_box">
                                  <JoditEditor
                                    className="editor"
                                    id="desc"
                                    ref={editor}
                                    value={sellerDescription}
                                    tabIndex={1}
                                    onBlur={(newContent) =>
                                      setSellerDescription(newContent)
                                    }
                                    onChange={(newContent) => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="profile_form_button">
                          <button>Update Profile</button>
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
