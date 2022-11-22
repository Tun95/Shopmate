import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./settings.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, other: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    case "UPDATE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "UPDATE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "UPDATE_FAIL":
      return { ...state, loadingDelete: false };
    case "UPDATE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
function Settings() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, other, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const params = useParams();
  const { id: otherId } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //FETCHING
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/settings/${otherId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTitle(data.title);
        setDescription(data.description);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [otherId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/settings/${otherId}`,
        {
          title,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/settings");
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  //DELETE
  const deleteHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/settings/${otherId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/settings`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };
  return (
    <>
      <div className="new-settings-edit">
        <div className="new-box">
          <div className="settings">
            <div className="d_flex">
              <h1 className="settingsTitle">{other?.title}</h1>
              <i
                onClick={() => {
                  navigate(`/admin/create-settings`);
                }}
                className="fa-solid fa-square-plus"
              ></i>
            </div>

            <form action="" className="settingsForm">
              <div className="settingsItem">
                <input
                  type="text"
                  placeholder="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                />
                <div className="settings-btn">
                  <button onClick={deleteHandler} className="settingsButton">
                    Delete
                  </button>
                  <button
                    onClick={submitHandler}
                    className="settingsButton update-btn"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default Settings;
