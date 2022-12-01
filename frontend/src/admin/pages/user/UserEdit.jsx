import React, { useContext, useReducer } from "react";
import "./useredit.css";
import person from "../../images/person.png";
import photo from "../../images/photo.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";

import PublishIcon from "@mui/icons-material/Publish";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";

import { Context } from "../../../Context/Context";
import { useState } from "react";
import { useEffect } from "react";
import { getError } from "../../../components/Utilities/Utils";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import Footer from "../../../components/Footer/Footer";

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

function User() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: userId } = params;

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, user }, dispatch] = useReducer(
    reducer,
    {
      user: [],
      loading: true,
      error: "",
    }
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  //FETCHING
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
        setIsAdmin(data.isAdmin);
        setIsSeller(data.isSeller);
        setImage(data.image);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    console.log(userId);
  }, [userId, userInfo]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          phone,
          address,
          country,
          image,
          isAdmin,
          isSeller,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL" });
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

  return (
    <>
      {" "}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="new-user-edit">
            <Helmet>
              <title>Edit User ${userId}</title>
            </Helmet>

            <div className="new-box">
              <div className="user">
                <div className="userTitleContainer">
                  <h1 className="userTitle">Edit User</h1>
                </div>
                <div className="userContainer">
                  <div className="userShow">
                    <div className="userShowTop">
                      <img
                        src={user.image ? user.image : person}
                        alt=""
                        className="userShowImg"
                      />
                      <div className="userShowTopTitle">
                        <span className="userShowUsername">{user.name}</span>
                        <span className="userShowUserTitle">
                          {user.isAdmin && user.isSeller
                            ? "Admin & Seller"
                            : user.isSeller
                            ? "Seller"
                            : user.isAdmin
                            ? "Admin"
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="userShowBottom">
                      <span className="userShowTitle">Account Details</span>
                      <div className="userShowInfo">
                        <PermIdentityIcon className="userShowIcon" />
                        <span className="userShowInfoTitle">
                          <div>{user.name}</div>
                        </span>
                      </div>
                      <div className="userShowInfo">
                        <CalendarTodayIcon className="userShowIcon" />
                        <span className="userShowInfoTitle">10.12.1999</span>
                      </div>
                      <span className="userShowTitle">Contact Details</span>
                      <div className="userShowInfo">
                        <PhoneAndroidIcon className="userShowIcon" />
                        <span className="userShowInfoTitle">{user.phone}</span>
                      </div>
                      <div className="userShowInfo">
                        <MailOutlineIcon className="userShowIcon" />
                        <span className="userShowInfoTitle">{user.email}</span>
                      </div>
                      <div className="userShowInfo">
                        <LocationSearchingIcon className="userShowIcon" />
                        <span className="userShowInfoTitle">
                          {user.address}, {user.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="userUpdate">
                    <span className="userUpdateTitle">Edit</span>
                    <form
                      action=""
                      className="userUpdateForm"
                      onSubmit={submitHandler}
                    >
                      <div className="userUpdateLeft">
                        <div className="userUpdateItem">
                          <label>Full Name</label>
                          <input
                            type="text"
                            placeholder="Tunji Akande"
                            className="userUpdateInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="userUpdateItem">
                          <label>Email</label>
                          <input
                            type="email"
                            placeholder="tunji@gmail.com"
                            className="userUpdateInput"
                            value={email}
                            disabled={userInfo?.isAdmin}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <>
                          <div className="userUpdateItem">
                            <label>Phone</label>
                            <input
                              type="text"
                              placeholder="+1 123 456 78"
                              className="userUpdateInput"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="userUpdateItem">
                            <label>Address</label>
                            <input
                              type="text"
                              placeholder="New Your | USA"
                              className="userUpdateInput"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                          <div className="userUpdateItem">
                            <label>Country</label>
                            <input
                              type="text"
                              placeholder="USA"
                              className="userUpdateInput"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            />
                          </div>
                        </>

                        <div className="userUpdateItem">
                          <div className="user-isAdminSeller">
                            <div className="user-is-admin">
                              <input
                                type="checkbox"
                                checked={isAdmin}
                                id="isAdmin"
                                name="action"
                                onChange={(e) => setIsAdmin(e.target.checked)}
                              />
                              <label htmlFor="isAdmin">Admin</label>
                            </div>
                            <div className="user-is-seller">
                              <input
                                type="checkbox"
                                checked={isSeller}
                                id="isSeller"
                                name="action"
                                onChange={(e) => setIsSeller(e.target.checked)}
                              />
                              <label htmlFor="isSeller">Seller</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="userUpdateRight">
                        <div className="userUpdateUpload">
                          <img
                            src={image ? image : person}
                            alt=""
                            className="userUpdateImg"
                          />
                          <label htmlFor="file">
                            <PublishIcon
                              className="userUpdateIcon"
                              onChange={uploadFileHandler}
                            />
                          </label>
                          <input
                            type="file"
                            id="file"
                            onChange={uploadFileHandler}
                            style={{ display: "none" }}
                          />
                        </div>
                        <button className="userUpdateButton">Update</button>
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

export default User;
