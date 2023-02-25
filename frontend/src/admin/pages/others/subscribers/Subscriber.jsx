import axios from "axios";
import React, { useContext, useReducer, useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../../../../components/Utilities/Utils";
import { Context } from "../../../../Context/Context";
import "./styles.css";
import JoditEditor from "jodit-react";
import Footer from "../../../../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { URL } from "../../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUBSCRIBER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUBSCRIBER_SUCCESS":
      return { ...state, loading: false, subscribers: action.payload };
    case "FETCH_SUBSCRIBER_FAIL":
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
function Subscriber() {
  const editor = useRef(null);

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, subscribers, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  //FETCH ALL SUBSCRIBERS
  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: "FETCH_SUBSCRIBER_REQUEST" });
      try {
        const { data } = await axios.get(`/api/message`, {
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
      const { data } = await axios.post(`/api/message/send`, {
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
      <Helmet>
        <title>Subscribers</title>
      </Helmet>
      <div className="new-settings-edit subscribers">
        <div className="new-box ">
          <div className="settings ">
            <div className="filter-create-box newsStyle">
              <div className=" BannerForm">
                <div className="admin-settings-section news-letter">
                  <h1 className="settingsTitle newsLetterTitle">
                    News Letter Subscriber
                  </h1>
                  <div className="admin-settings-table newsLetterTable">
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
                          <ul
                            className="admin-settings-item-list"
                            key={item._id}
                          >
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
                    <div className="">
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
                          <div className="form_box">
                            <JoditEditor
                              className="editor"
                              id="desc"
                              ref={editor}
                              value={message}
                              // config={config}
                              tabIndex={1} // tabIndex of textarea
                              onBlur={(newContent) => setMessage(newContent)} // preferred to use only this option to update the content for performance reasons
                              onChange={(newContent) => {}}
                            />
                          </div>{" "}
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
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default Subscriber;
