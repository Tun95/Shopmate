import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../../common/footer/Footer";
import { getError } from "../../../../components/Utilities/util/Utils";
import { Context } from "../../../../Context/Context";
import JoditEditor from "jodit-react";
import { Helmet } from "react-helmet-async";
import { request } from "../../../../base_url/Base_URL";

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

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

export function BannerUpdate() {
  const editor = useRef(null);

  const params = useParams();
  const { id: bannerId } = params;

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

  //FETCHING
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/banner/${bannerId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTitle(data.title);
        setBackground(data.background);
        setAdslink(data.adslink);
        setDescriptions(data.descriptions);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [bannerId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${request}/api/banner/${bannerId}`,
        {
          title,
          background,
          adslink,
          descriptions,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/banners");
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
      await axios.delete(`${request}/api/banner/${bannerId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/banners`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  //BANNER BACKGROUND
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
        <title>Banner Update</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-banner`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className=" BannerForm">
                <h1 className="settingsTitle">Update Banner</h1>
                <form action="" className="settingsForm">
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
                    <div className="settings-btn">
                      <button
                        onClick={deleteHandler}
                        className="settingsButton"
                      >
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
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}
