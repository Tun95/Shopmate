import axios from "axios";
import e from "cors";
import React, { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./settings.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, other: action.payload };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function AddSettings() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, other }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //CREATE
  const createHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/settings",
        { title, description },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      toast.success("Created successfully", {
        position: "bottom-center",
      });
      navigate(`/admin/settings`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  return (
    <>
      <div className="new-settings-edit">
        <div className="new-box">
          <div className="settings">
            <h1 className="settingsTitle">Add New</h1>
            <form action="" className="settingsForm" onSubmit={createHandler}>
              <div className="settingsItem">
                <input
                  type="text"
                  placeholder="Title e.g privacy policy"
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
                {/* <textarea
                  type="text"
                  placeholder="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                /> */}
                <div className="settings-btn">
                  <button className="settingsButton setting-create">
                    Create
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

export default AddSettings;
