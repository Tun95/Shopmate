import React, { useContext, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import axios from "axios";
import { Context } from "../../Context/Context";
import LoadingBox from "../Utilities/LoadingBox";
import MessageBox from "../Utilities/MessageBox";
import { getError } from "../Utilities/Utils";
import "./wishlist.css";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
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

function Wishlist() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const params = useParams();

  const [{ loading, error, user, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const { id: userId } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete, userId, userInfo]);
  console.log(user);

  //DELETE PRODUCT
  const deleteHandler = async (wish) => {
    try {
      await axios.delete(`/api/wishes/${wish._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Remove successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <>
          <div className="wish">
            <div className="wish-contanainer">
              <div className="wish_header">
                <h2>My Wish List</h2>
              </div>
              <div className="wish-box">
                <div className="box">
                  <div className="boxStyles">
                    {user?.wish?.map((item, index) => (
                      <div key={index}>
                        <div className="product-list">
                          <div className="prod-design">
                            <div className="top-list-product">
                              <div className="delete">
                                <DeleteIcon
                                  className="deleteBtn"
                                  onClick={() => deleteHandler(item)}
                                />
                              </div>
                              <Link to={`/product/${item.slug}`}>
                                {" "}
                                <img
                                  src={item.image}
                                  className="product-img"
                                  alt={item.name}
                                />
                              </Link>

                              <div className="p-name">
                                <Link to={`/product/${item.slug}`}>
                                  <h4>{item.name}</h4>
                                </Link>
                                <div className="price">£{item.price}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Wishlist;
