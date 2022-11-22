import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Footer from "../../../components/Footer/Footer";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./settings.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, other: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function SettingsList() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, other }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //FETCH ALL
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/settings", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [userInfo]);
  console.log(other);

  return (
    <>
      {" "}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="admin-settings">
            <Helmet>
              <title>Settings</title>
            </Helmet>

            <div className="admin-settings-box">
              <div className="d_flex">
                <h1 className="settings-admin-header">Settings</h1>
                <i
                  onClick={() => {
                    navigate(`/admin/create-settings`);
                  }}
                  className="fa-solid fa-square-plus"
                ></i>
              </div>
              <div className="admin-settings-section">
                <div className="admin-settings-table">
                  <div className="admin-settings-table-header">
                    <ul>
                      <li className="admin-settings-item">TITLE</li>
                      <li className="admin-settings-user">USER</li>
                      <li className="admin-settings-date">DATE</li>
                      <li className="admin-settings-actions">EDIT</li>
                    </ul>
                  </div>

                  <div className="admin-settings-table-body">
                    <div className="admin-settings-table-row">
                      {other?.map((item) => (
                        <ul className="admin-settings-item-list" key={item._id}>
                          <li className="admin-item-title">{item.title}</li>
                          <li className="admin-user-name">
                            <img src={item.user.image} alt="" />
                            {item.user ? item.user.name : "DELETED USER"}
                          </li>
                          <li className="admin-created">
                            {item.createdAt.substring(0, 10)}
                          </li>
                          <li className="admin-settings-btn-view">
                            <i
                              onClick={() => {
                                navigate(`/admin/update-settings/${item._id}`);
                              }}
                              className="fa-solid fa-pen-to-square"
                            ></i>
                            &nbsp;
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsList;
