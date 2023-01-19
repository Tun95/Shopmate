import React from "react";
import "./featuredInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

function FeaturedInfo(props) {
  const { summary, currency, currencySign } = props;

  const salesPerc = (
    ((summary.income[0]?.sales - summary.income[1]?.sales) /
      summary.income[1]?.sales) *
    100
  ).toFixed(0);

  //TOTAL USER
  const userNum = summary.users ? summary?.users[0]?.numUsers : 0;
  const TotalUsers = userNum?.toLocaleString("en-GB");

  //TOTAL ORDERS
  const orderNum = summary.orders ? summary?.orders[0]?.numOrders : 0;
  const TotalOrders = orderNum?.toLocaleString("en-GB");

  //TOTAL SALES PER MONTHS
  const salesTotal = summary.income[0]?.sales
    ? summary.income[0]?.sales.toFixed(0)
    : 0;
  let TotalSales = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(salesTotal);

  console.log(summary);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Users</span>
        <div className="featuredMoneyContainer muiIcon_display">
          <span className="featuredMoney">{TotalUsers}</span>
          <span className="featuredMoneyRate ">
            <PersonIcon className="muiIcon" />
          </span>
        </div>
        <span className="featuredSub">Total Register Users</span>
      </div>
      <div className="featuredItem featuredItem-two">
        <span className="featuredTitle">Orders</span>
        <div className="featuredMoneyContainer muiIcon_display">
          <span className="featuredMoney">{TotalOrders}</span>
          <span className="featuredMoneyRate ">
            <WorkIcon className="muiIcon" />
          </span>
        </div>
        <span className="featuredSub">Total number of Orders</span>
      </div>
      <div className="featuredItem featuredItem-three">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{TotalSales}</span>
          <span className="featuredMoneyRate">
            %{Math.abs(salesPerc) || 0}{" "}
            {salesPerc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon positive" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to previous day sales</span>
      </div>
    </div>
  );
}

export default FeaturedInfo;
