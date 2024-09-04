import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarchartComponent = () => {
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
      className="bg-bg-white rounded-md shadow-sm"
      width="100%"
      height={300}
    >
      <h1 className=" p-2 mb1 text-lg font-medium">
        Total Companies{" "}
        <span className="min-w-3 bg-state-state1 min-h-3 px-2 rounded-md text-primary-light font-semibold">
          count
        </span>
      </h1>
      <BarChart  margin={{ top: 0, left: 10, right: 10, bottom: 50 }}  data={data}>
        <></>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar
          radius={5}
          dataKey="pv"
          fill="#F9D9E8"
          strokeWidth={1}
          barSize={40}
          activeBar={{ fill: "#F82980", strokeWidth: 4 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarchartComponent;
