import React from "react";
import "./featuredInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function FeaturedInfo(props) {
  const { summary, salesStats } = props;

  const userPerc = (
    (summary.users[0]?.numUsers * 100) / summary.users[1]?.numUsers -
    100
  ).toFixed(0);

  const orderPerc =
    (
      (summary.orders[0]?.numOrders * 100) / summary.orders[1]?.numOrders -
      100
    ).toFixed(0) || 0;

  const salesPerc = (
    (summary.orders[0]?.totalSales * 100) / summary.orders[1]?.totalSales -
    100
  ).toFixed(0);

  //TOTAL USER PER MONTHS
  const userNum =
    summary.users && summary.users[1] ? summary.users[0]?.numUsers : 0;
  const TotalUsers = userNum?.toLocaleString("en-GB");

  //TOTAL USER PER MONTHS
  const orderNum =
    summary.orders && summary.users[1] ? summary.orders[0].numOrders : 0;
  const TotalOrders = orderNum?.toLocaleString("en-GB");

  //TOTAL SALES PER MONTHS
  const salesTotal =
    summary.orders && summary.users[1]
      ? summary.orders[0]?.totalSales.toFixed(0)
      : 0;
  let TotalSales = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(salesTotal);

  console.log(summary);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{TotalUsers}</span>
          <span className="featuredMoneyRate">
            %{userPerc > 0 ? Math.abs(userPerc) : 0}{" "}
            {userPerc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon positive" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem featuredItem-two">
        <span className="featuredTitle">Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{TotalOrders}</span>
          <span className="featuredMoneyRate">
            %{orderPerc > 0 ? Math.abs(orderPerc) : 0}{" "}
            {orderPerc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon positive" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem featuredItem-three">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{TotalSales}</span>
          <span className="featuredMoneyRate">
            %{salesPerc > 0 ? Math.abs(salesPerc) : 0}{" "}
            {salesPerc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon positive" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}

export default FeaturedInfo;
