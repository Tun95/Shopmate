import axios from "axios";
import React, { useContext, useReducer } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";

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
export function Category() {
  const [category, setCategory] = useState();

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
        "/api/category",
        { category },
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
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Add New Category</h1>
                <form
                  action=""
                  className="settingsForm"
                  onSubmit={createHandler}
                >
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="category e.g Women"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
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

export function Brand() {
  const [brand, setBrand] = useState();

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
        "/api/brand",
        { brand },
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
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Add New Brand</h1>
                <form
                  action=""
                  className="settingsForm"
                  onSubmit={createHandler}
                >
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="brand e.g Nike"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
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

export function Size() {
  const [size, setSize] = useState();
	
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
        "/api/size",
        { size },
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
        <div className="new-box filter-create-shadow">
          <div className="settings ">
            <div className="filter-create-box">
              <div className="FilterForm">
                <h1 className="settingsTitle">Add New Size</h1>
                <form
                  action=""
                  className="settingsForm"
                  onSubmit={createHandler}
                >
                  <div className="settingsItem ">
                    <input
                      type="text"
                      placeholder="size e.g XXL or 32"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
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
