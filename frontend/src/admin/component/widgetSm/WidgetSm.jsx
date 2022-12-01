import React, { useContext, useEffect, useReducer } from "react";
import "./widgetSm.css";
import person from "../../images/person.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Context } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function WidgetSm() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

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
    fetchData();
  }, [userInfo]);
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <div className="small-user-list">
        {users?.slice(0, 20).map((user, index) => (
          <ul className="widgetSmList" key={index}>
            <li className="widgetSmListItem">
              <img
                src={user.image ? user.image : person}
                alt=""
                className="widgetSmImg"
              />
              <div className="widgetSmUser">
                <span className="widgetSmUsername">{user.name}</span>
                <span className="widgetSmUserTitle">
                  {user.isAdmin && user.isSeller
                    ? "Seller & Admin"
                    : user.isSeller
                    ? "Seller"
                    : user.isAdmin
                    ? "Admin"
                    : "Customer"}
                </span>
              </div>
              <button
                className="widgetSmButton"
                onClick={() => {
                  navigate(`/admin/useredit/${user._id}`);
                }}
              >
                <VisibilityIcon className="widgetSmIcon" />
                Display
              </button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default WidgetSm;
