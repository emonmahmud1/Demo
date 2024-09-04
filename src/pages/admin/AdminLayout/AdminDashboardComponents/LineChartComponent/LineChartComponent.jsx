import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineChartComponent = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <ResponsiveContainer
      className="bg-bg-white rounded-md shadow-sm"
      width="100%"
      height={400}
    >
      <div className="flex gap-2 flex-wrap">
        <h1 className=" p-2 mb1 text-lg font-medium">
          <span className=" w-4 bg-primary-light 1 min-h-2 px-2 rounded-lg  mr-2"></span>
          Monthly Ticket Count
        </h1>

        <h1 className=" p-2 mb1 text-lg font-medium">
          <span className=" w-4 bg-secondary-light 1 min-h-2 px-2 rounded-lg  mr-2"></span>
          Total Queries
        </h1>
      </div>
      <LineChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 100,
        }}
      >
        {/* <CartesianGrid  strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend layout="horizontal" verticalAlign="top" align="center" /> */}
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#FD982E"
          activeDot={{ r: 8 }}
          strokeWidth={5}
        />
        <Line strokeWidth={5} type="monotone" dataKey="uv" stroke="#F94491" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
