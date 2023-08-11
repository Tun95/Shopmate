import React, { useContext, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../common/footer/Footer";
import axios from "axios";
import { Context } from "../../Context/Context";
import LoadingBox from "../Utilities/message loading/LoadingBox";
import MessageBox from "../Utilities/message loading/MessageBox";
import { getError } from "../Utilities/util/Utils";
import "./styles.scss";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { Helmet } from "react-helmet-async";
import { request } from "../../base_url/Base_URL";

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

function Wishlist({ currencySign }) {
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
        const { data } = await axios.get(`${request}/api/users/${userId}`, {
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
      await axios.delete(`${request}/api/wishes/${wish._id}`, {
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
            <Helmet>
              <title>Wish List</title>
            </Helmet>
            <div className="wish-contanainer">
              <div className="wish_header">
                <h2>My Wish List</h2>
              </div>
              <div className="wish-box">
                <div className="box">
                  {user?.wish?.length === 0 && (
                    <span className="product-not">
                      <MessageBox>No Product Found </MessageBox>
                    </span>
                  )}
                  {user?.wish?.map((product, index) => (
                    <div key={index}>
                      <div className=" wish_product_list">
                        <div className=" wish_list_design">
                          <div className="delete">
                            <DeleteIcon
                              className="deleteBtn"
                              onClick={() => deleteHandler(product)}
                            />
                          </div>
                          <Link to={`/product/${product.slug}`}>
                            {" "}
                            <img
                              src={product.image}
                              className="product-img"
                              alt={product.name}
                            />
                          </Link>

                          <div className="p-name">
                            <Link to={`/product/${product.slug}`}>
                              <h4>{product.name}</h4>
                            </Link>
                            <div className="price">
                              {product.discount > 0 ? (
                                <>
                                  <div>
                                    <div className="price">
                                      {currencySign}
                                      {(
                                        product.price -
                                        (product.price * product.discount) / 100
                                      )?.toFixed(2)}
                                    </div>
                                    <s className="discount">
                                      {currencySign}
                                      {product.price?.toFixed(2)}
                                    </s>
                                  </div>
                                </>
                              ) : (
                                <div className="price">
                                  {currencySign}
                                  {product.price?.toFixed(2)}
                                </div>
                              )}
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
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Wishlist;
