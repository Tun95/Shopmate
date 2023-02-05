import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../../components/Footer/Footer";
import { getError } from "../../../../components/Utilities/Utils";
import { Context } from "../../../../Context/Context";

import PublishIcon from "@mui/icons-material/Publish";
import { Helmet } from "react-helmet-async";

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
export function CategoryUpdate() {
  const params = useParams();
  const { id: categoryId } = params;

  const [category, setCategory] = useState();

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
        const { data } = await axios.get(`/api/category/${categoryId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategory(data.category);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [categoryId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/category/${categoryId}`,
        {
          category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/filters");
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
      await axios.delete(`/api/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/filters`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Category</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-category`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Update Category</h1>
                <form action="" className="settingsForm">
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="category e.g Women"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
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

export function BrandUpdate() {
  const params = useParams();
  const { id: brandId } = params;

  const [brand, setBrand] = useState();

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
        const { data } = await axios.get(`/api/brand/${brandId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setBrand(data.brand);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [brandId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/brand/${brandId}`,
        {
          brand,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/filters");
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
      await axios.delete(`/api/brand/${brandId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/filters`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Brand</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-brand`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Update Brand</h1>
                <form action="" className="settingsForm">
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="brand e.g Nike"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
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

export function SizeUpdate() {
  const params = useParams();
  const { id: sizeId } = params;

  const [size, setSize] = useState();

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
        const { data } = await axios.get(`/api/size/${sizeId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSize(data.size);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [sizeId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/size/${sizeId}`,
        {
          size,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/filters");
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
      await axios.delete(`/api/size/${sizeId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/filters`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Size</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-size`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Update Size</h1>
                <form action="" className="settingsForm">
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="size e.g XXL"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
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

export function PriceUpdate() {
  const params = useParams();
  const { id: priceId } = params;

  const [price, setPrice] = useState();
  const [priceSpan, setPriceSpan] = useState();

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
        const { data } = await axios.get(`/api/price/${priceId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setPrice(data.price);
        setPriceSpan(data.priceSpan);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [priceId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/price/${priceId}`,
        {
          price,
          priceSpan,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/filters");
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
      await axios.delete(`/api/price/${priceId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/filters`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Price</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-price`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Update Price</h1>
                <form action="" className="settingsForm">
                  <div className="settingsItem ">
                    <span className="color_split ">
                      <input
                        type="text"
                        placeholder="price e.g 10-20"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="price e.g £10-£20"
                        value={priceSpan}
                        onChange={(e) => setPriceSpan(e.target.value)}
                      />
                    </span>
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

export function ColorUpdate() {
  const params = useParams();
  const { id: colorId } = params;

  const [color, setColor] = useState("");
  const [colorName, setColorName] = useState("");

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
        const { data } = await axios.get(`/api/color/${colorId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setColor(data.color);
        setColorName(data.colorName);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [colorId, userInfo.token]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/color/${colorId}`,
        {
          color,
          colorName,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully", {
        position: "bottom-center",
      });
      navigate("/admin/filters");
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
      await axios.delete(`/api/color/${colorId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(" Deleted successfully", {
        position: "bottom-center",
      });
      dispatch({ type: "DELETE_SUCCESS" });
      navigate(`/admin/filters`);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  //IMAGE UPLOAD
  const uploadFileHandler = async (e, forImages) => {
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
      setColor(data.secure_url);
      toast.success("Image uploaded successfully. Click update to apply it", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Color</title>
      </Helmet>
      <div className="new-settings-edit">
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <i
              onClick={() => {
                navigate(`/admin/create-color`);
              }}
              className="fa-solid fa-square-plus"
            ></i>
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Update Color</h1>
                <form action="" className="settingsForm">
                  <div className="settingsItem ">
                    <span className="color_split color_split_split">
                      <input
                        type="text"
                        placeholder="color e.g red"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                      />
                      <img src={color} alt="color" className="color_image" />
                      <label htmlFor="file">
                        <PublishIcon
                          className="upload-btn color_upload_btn"
                          onChange={uploadFileHandler}
                        />
                      </label>
                      <input
                        onChange={uploadFileHandler}
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                      />
                    </span>
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
