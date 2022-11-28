import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

    case "FETCH_SUBSCRIBER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUBSCRIBER_SUCCESS":
      return { ...state, loading: false, subscribers: action.payload };
    case "FETCH_SUBSCRIBER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CATEGORY_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_BRAND_REQUEST":
      return { ...state, loading: true };
    case "FETCH_BRAND_SUCCESS":
      return { ...state, loading: false, brands: action.payload };
    case "FETCH_BRAND_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SIZE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SIZE_SUCCESS":
      return { ...state, loading: false, sizes: action.payload };
    case "FETCH_SIZE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    case "SEND_REQUEST":
      return { ...state, loading: true };
    case "SEND_SUCCESS":
      return { ...state, loading: false };
    case "SEND_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function SettingsList() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [
    { loading, error, other, subscribers, categories, brands,sizes, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //FETCH ALL SETTINGS
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

  //FETCH ALL CATEGORY
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const { data } = await axios.get("/api/category", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_CATEGORY_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(categories);

  //FETCH ALL BRANDS
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_BRAND_REQUEST" });
      try {
        const { data } = await axios.get("/api/brand", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_BRAND_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_BRAND_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(brands);

  //FETCH ALL SIZE
  useEffect(() => {
    const fetchData = async () => {
      //dispatch({ type: "FETCH_SIZE_REQUEST" });
      try {
        const { data } = await axios.get("/api/size", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SIZE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_SIZE_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(sizes);

  //FETCH ALL SUBSCRIBERS
  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: "FETCH_SUBSCRIBER_REQUEST" });
      try {
        const { data } = await axios.get("/api/message", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUBSCRIBER_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_SUBSCRIBER_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete, userInfo]);

  //DELETE SUBSCRIBERS
  const deleteHandler = async (subscriber) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/message/${subscriber._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  //SEND
  const sendHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/message/send", {
        subject,
        message,
      });
      dispatch({ type: "SEND_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });
    } catch (err) {
      dispatch({ type: "SEND_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
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
              <div className="admin-settings-section setting-margin-b">
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
              <div className="filterSettings">
                {/* CATEGORY */}
                <div className="admin-settings-section filter-settings">
                  <h1 className="settingsTitle newsLetterTitle FilterTitle">
                    CATEGORIES
                  </h1>
                  <i
                    onClick={() => {
                      navigate(`/admin/create-category`);
                    }}
                    className="fa-solid fa-square-plus filterPlus"
                  ></i>
                  <div className="admin-settings-table filter-settings-table">
                    <div className="admin-settings-table-header">
                      <ul className="filter-settings-header">
                        <li className="admin-settings-item">CATEGORY</li>
                        <li className="admin-settings-actions">EDIT</li>
                      </ul>
                    </div>

                    <div className="admin-settings-table-body">
                      <div className="admin-settings-table-row filter-settings-list filter-style">
                        {categories?.map((item) => (
                          <ul
                            className="admin-settings-item-list filter-settings-list"
                            key={item._id}
                          >
                            <li className="admin-item-title">
                              {item.category}
                            </li>
                            <li className="admin-settings-btn-view">
                              <i
                                onClick={() => {
                                  navigate(
                                    `/admin/update-category/${item._id}`
                                  );
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
                {/* SIZE */}
                <div className="admin-settings-section filter-settings">
                  <h1 className="settingsTitle newsLetterTitle FilterTitle">
                    SIZE
                  </h1>
                  <i
                    onClick={() => {
                      navigate(`/admin/create-size`);
                    }}
                    className="fa-solid fa-square-plus filterPlus"
                  ></i>
                  <div className="admin-settings-table filter-settings-table">
                    <div className="admin-settings-table-header">
                      <ul className="filter-settings-header">
                        <li className="admin-settings-item">SIZE</li>
                        <li className="admin-settings-actions">EDIT</li>
                      </ul>
                    </div>

                    <div className="admin-settings-table-body">
                      <div className="admin-settings-table-row filter-settings-list filter-style">
                        {sizes?.map((item) => (
                          <ul
                            className="admin-settings-item-list filter-settings-list"
                            key={item._id}
                          >
                            <li className="admin-item-title">{item.size}</li>

                            <li className="admin-settings-btn-view">
                              <i
                                onClick={() => {
                                  navigate(`/admin/update-size/${item._id}`);
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
                {/* BRAND*/}
                <div className="admin-settings-section filter-settings">
                  <h1 className="settingsTitle newsLetterTitle FilterTitle">
                    BRANDS
                  </h1>
                  <i
                    onClick={() => {
                      navigate(`/admin/create-brand`);
                    }}
                    className="fa-solid fa-square-plus filterPlus"
                  ></i>
                  <div className="admin-settings-table filter-settings-table">
                    <div className="admin-settings-table-header">
                      <ul className="filter-settings-header">
                        <li className="admin-settings-item">BRANDS</li>
                        <li className="admin-settings-actions">EDIT</li>
                      </ul>
                    </div>

                    <div className="admin-settings-table-body">
                      <div className="admin-settings-table-row filter-settings-list filter-style">
                        {brands?.map((item) => (
                          <ul
                            className="admin-settings-item-list filter-settings-list"
                            key={item._id}
                          >
                            <li className="admin-item-title">{item.brand}</li>

                            <li className="admin-settings-btn-view">
                              <i
                                onClick={() => {
                                  navigate(`/admin/update-brand/${item._id}`);
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
                {/* PRICE */}
              </div>
              {/* NEW LETTER */}
              <div className="admin-settings-section news-letter">
                <h1 className="settingsTitle newsLetterTitle">
                  News Letter Subscriber
                </h1>
                <div className="admin-settings-table">
                  <div className="admin-settings-table-header">
                    <ul>
                      <li className="admin-settings-item">EMAILS</li>
                      <li className="admin-settings-date">DATE</li>
                      <li className="admin-settings-actions">DELETE</li>
                    </ul>
                  </div>

                  <div className="admin-settings-table-body">
                    <div className="admin-settings-table-row">
                      {subscribers?.map((item) => (
                        <ul className="admin-settings-item-list" key={item._id}>
                          <li className="admin-item-title">{item.email}</li>
                          <li className="admin-created">
                            {item.createdAt.substring(0, 10)}
                          </li>
                          <li className="admin-settings-btn-view">
                            <button
                              onClick={() => deleteHandler(item)}
                              type="button"
                              className="newsLetterDelete"
                            >
                              Delete
                            </button>
                            &nbsp;
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="new-settings-edit">
                <div className="new-box">
                  <div className="settings">
                    <h1 className="settingsTitle">Send News Letter</h1>
                    <form
                      action=""
                      className="settingsForm"
                      onSubmit={sendHandler}
                    >
                      <div className="settingsItem">
                        <input
                          type="text"
                          placeholder="Subject e.g new letter"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                        <CKEditor
                          editor={ClassicEditor}
                          data={message}
                          config={{
                            ckfinder: {
                              uploadUrl: "/api/upload",
                            },
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setMessage(data);
                          }}
                        />
                        <div className="settings-btn">
                          <button className="settingsButton setting-create">
                            Send
                          </button>
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
        </div>
      )}
    </>
  );
}

export default SettingsList;
