import React from "react";
import Charts from "../../component/chart/Charts";
import FeaturedInfo from "../../component/featuredInfo/FeaturedInfo";
import "./dashboard.css";
import WidgetSm from "../../component/widgetSm/WidgetSm";
import WidgetLg from "../../component/widgetLg/WidgetLg";
import { useReducer } from "react";
import { useContext } from "react";
import { Context } from "../../../Context/Context";
import { useEffect, useState } from "react";
import { getError } from "../../../components/Utilities/Utils";
import axios from "axios";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import { URL } from "../../../base_url/Base_URL";

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
function Dashboard(props) {
  const { currency, currencySign } = props;

  const navigate = useNavigate();

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${URL}/api/orders/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        console.log(err);
      }
    };
    fetchData();
  }, [userInfo]);

  //STATS FETCHING
  const [salesStats, setSalesStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      summary.dailyOrders
        ?.reverse()
        ?.map((item) =>
          setSalesStats((prev) => [
            ...prev,
            { name: item._id, "Total Sales": item.sales },
          ])
        );
    };
    getStats();
  }, [summary.dailyOrders]);

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="dashboard-box">
            <Helmet>
              <title>Admin Dashboard</title>
            </Helmet>
            <div className="dasboard">
              <div className="dashboard-home">
                <div className="dashboard-home-view">
                  <div className="dash-feature">
                    <FeaturedInfo
                      summary={summary}
                      salesStats={salesStats}
                      currency={currency}
                      currencySign={currencySign}
                    />
                    {/* <div className="chart">
              <h3 className="chartTitle">Sales</h3>
              <Chart
                width="100%"
                height="300px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            </div> */}
                    <div className="dashbaord-chart">
                      <Charts
                        data={salesStats}
                        currency={currency}
                        currencySign={currencySign}
                        title="Sales"
                        grid
                        dataKey="Total Sales"
                      />
                    </div>
                  </div>
                  <div className="homeWidgets">
                    <WidgetSm />
                    <WidgetLg currencySign={currencySign} />
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

export default Dashboard;
