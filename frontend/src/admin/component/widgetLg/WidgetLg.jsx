import React, { useContext, useEffect, useReducer } from "react";
import "./widgetLg.css";
import pp2 from "../../images/pp2.png";
import { Context } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../../../components/Utilities/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Orders</h3>
      <div className="table-box-listoder">
        <ul className="widgetLgTr">
          <li className="widgetLgTh ">Customer</li>
          <li className="widgetLgTh-date">Date</li>
          <li className="widgetLgTh-amount">Amount</li>
          <li className="widgetLgTh-status">Status</li>
        </ul>

        <div className="scroll-widget">
          <div className="widgetLgTable">
            <table>
              <tbody>
                {orders
                  ?.reverse()
                  .slice(0, 20)
                  .map((order) => (
                    <tr className="widgetLgTr-body " key={order._id}>
                      <td className="widgetLgUser">
                        <span className="widgetLgName">{order._id}</span>
                      </td>
                      <td className="widgetLgDate">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="widgetLgAmount">
                        {" "}
                        £{order.grandTotal.toFixed(2)}
                      </td>
                      <td className="widgetLgStatus">
                        {order.isDelivered ? (
                          <Button type="Approved" />
                        ) : order.isPaid ? (
                          <Button type="Pending" />
                        ) : (
                          <Button type="Declined" />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetLg;
