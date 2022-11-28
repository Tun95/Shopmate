import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";

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
      await axios.delete(`/api/category/${categoryId}`, {
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
      await axios.delete(`/api/brand/${brandId}`, {
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
      await axios.delete(`/api/size/${sizeId}`, {
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
