import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./userList.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    default:
      return state;
  }
};

function UserList() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, users, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    }
    fetchData();
  }, [successDelete, userInfo]);

  //USER DELETE
  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };
  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="admin-user">
            <Helmet>
              <title>Users</title>
            </Helmet>

            <div className="admin-user-box">
              <h1 className="user-admin-header">User List</h1>

              <div className="admin-user-section">
                <div className="admin-user-table">
                  <div className="admin-user-table-header">
                    <ul>
                      <li className="admin-user-list-id">ID</li>
                      <li className="admin-user-list">NAME</li>
                      <li className="admin-user-email">EMAIL</li>
                      <li className="admin-user-isseller">ISSELLER</li>
                      <li className="admin-user-isadmin">ISADMIN</li>
                      <li className="admin-user-actions">ACTIONS</li>
                    </ul>
                  </div>

                  <div className="admin-user-table-body">
                    <div className="admin-user-table-row">
                      {users?.map((user) => (
                        <ul className="admin-user-data-list" key={user._id}>
                          <li className="admin-user-id">{user._id}</li>
                          <li className="admin-user-name">{user.name}</li>
                          <li className="user-email">{user.email}</li>
                          <li className="admin-userIseller">
                            {user.isSeller ? (
                              <div className="admin-yes">YES</div>
                            ) : (
                              <div className="admin-negate">NO</div>
                            )}
                          </li>
                          <li className="admin-userIsadmin">
                            {user.isAdmin ? (
                              <div className="admin-yes">YES</div>
                            ) : (
                              <div className="admin-negate">NO</div>
                            )}
                          </li>
                          <li className="admin-user-btn-view">
                            <button
                              className="admin-user-btn"
                              onClick={() => {
                                navigate(`/admin/useredit/${user._id}`);
                              }}
                            >
                              Edit
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              className="admin-user-delete"
                              onClick={() => deleteHandler(user)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-pagination">
                {/* <div className="productlist-page">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                  key={x + 1}
                  to={`/admin/products?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div> */}
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

export default UserList;
