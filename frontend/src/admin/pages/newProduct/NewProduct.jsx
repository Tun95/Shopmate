import axios from "axios";
import React, { useContext } from "react";
import { useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { URL } from "../../../base_url/Base_URL";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./newProduct.css";

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
function NewProduct() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const createHandler = async () => {
    if (window.confirm("Are you sure to create a new product?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          `${URL}/api/products`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("product created successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "CREATE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };
  return (
    <div className="newProduct-box">
      <Helmet>
        <title>New Product</title>
      </Helmet>
      
      <div className="newproduct-width">
        <div className="newProduct">
          <h1 className="addProductTitle">New Product</h1>
          <form action="" className="addProductForm">
            <div className="addproductform-box-des">
              <div className="addproductform-box1">
                <div className="addProductItem">
                  <label htmlFor="file">Image</label>
                  <input type="file" id="file" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Stock</label>
                  <input type="text" placeholder="123" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Active</label>
                  <select name="active" id="active">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="addproductform-box2">
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
              </div>
              <div className="addproductform-box3">
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
                <div className="addProductItem">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="Novelty TShirt" />
                </div>
              </div>
            </div>
            <button className="addProductButton" onClick={createHandler}>
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewProduct;
