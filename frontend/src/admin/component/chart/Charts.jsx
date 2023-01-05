import React from "react";
import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  let TotalSales = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(payload[0]?.value);
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ padding: "10px" }}>
        <p className="label">{`${label}`}</p>
        <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
          Total Sales:{` ${TotalSales}`}
        </p>
      </div>
    );
  }

  return null;
};

function Charts({ title, data, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="99.9%" aspect={4 / 1}>
        <LineChart data={data}>
          <YAxis />
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
