import axios from "axios";
import { useContext, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../../../../components/Utilities/util/Utils";
import { Context } from "../../../../Context/Context";
import JoditEditor from "jodit-react";
import Footer from "../../../../common/footer/Footer";
import "./styles.css";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export function Banner() {
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [background, setBackground] = useState("");
  const [adslink, setAdslink] = useState("");
  const [descriptions, setDescriptions] = useState("");

  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //CREATE
  const createHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/banner",
        { title, background, adslink, descriptions },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      toast.success("Created successfully", {
        position: "bottom-center",
      });
      navigate(`/admin/banners`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
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
      setBackground(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Banner ads</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <div className="filter-create-box">
              <div className=" BannerForm">
                <h1 className="settingsTitle">Add New Banner</h1>
                <form
                  action=""
                  className="settingsForm"
                  onSubmit={createHandler}
                >
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="color e.g red"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="form_box">
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={descriptions}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setDescriptions(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="background_image">
                      <span className="display_block">
                        <small>Banner background image here:</small>
                        <span className="display_flex">
                          <input
                            type="text"
                            placeholder="banner background"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                          />

                          <span>
                            <label htmlFor="file">
                              <i
                                onChange={uploadFileHandler}
                                className="fa-solid fa-arrow-up-from-bracket"
                              ></i>
                            </label>
                            <input
                              onChange={uploadFileHandler}
                              type="file"
                              id="file"
                              style={{ display: "none" }}
                            />
                          </span>
                        </span>
                        <small>
                          <strong>(900 x 336)px</strong>
                        </small>
                      </span>

                      <div className="ads_link display_block">
                        <small>Banner ads link:</small>
                        <input
                          type="text"
                          placeholder="banner background"
                          value={adslink}
                          onChange={(e) => setAdslink(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="settings-btn Filterbtn">
                      <button className="settingsButton setting-create">
                        Create
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
    </>
  );
}
