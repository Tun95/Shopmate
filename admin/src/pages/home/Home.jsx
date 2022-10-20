import React from "react";
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useReducer } from "react";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import { useEffect } from "react";
import { getError } from "../../components/Utilities/Utils";
import axios from "axios";
import LoadingBox from "../../components/Utilities/LoadingBox";
import MessageBox from "../../components/Utilities/MessageBox";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function Home() {
  // const navigate = useNavigate();

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    // if (!userInfo) {
    //   navigate("/signin");
    // }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/summary`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-box">
      <Helmet>
        <title>Admin Home</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="home">
          <FeaturedInfo summary={summary} />
          <Chart
            data={userData}
            title="User Analytics"
            grid
            dataKey="Active User"
          />
          <div className="homeWidgets">
            <WidgetSm />
            <WidgetLg />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
