import React from "react";
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

function FeaturedInfo(props) {
  const { summary } = props;
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
          </span>
          <span className="featuredMoneyRate">
            -11.4 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {summary.orders && summary.users[0]
              ? summary.orders[0].numOrders
              : 0}
          </span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            £
            {summary.orders && summary.users[0]
              ? summary.orders[0].totalSales.toFixed(0)
              : 0}
          </span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon positive" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}

export default FeaturedInfo;
