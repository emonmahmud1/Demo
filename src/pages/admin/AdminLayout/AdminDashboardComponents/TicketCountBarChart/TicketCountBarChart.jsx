import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const TicketCountBarChart = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={50 * data.length}
      className="bg-bg-white rounded-md shadow-sm"
    >
      <h1 className=" p-2 mb1 text-lg font-medium">
        Average Category wise Ticket Count
      </h1>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <CartesianGrid />
        <Tooltip />
        <Legend />
        <Bar
          radius={5}
          dataKey="pv"
          fill="#FD982E"
          barSize={20}
          activeBar={{ fill: "#F9D9E8", strokeWidth: 4 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TicketCountBarChart;
