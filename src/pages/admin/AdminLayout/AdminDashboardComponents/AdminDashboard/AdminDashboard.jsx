import React from "react";

import PieChartTicketStatu from "../PieChartTicketStatu/PieChartTicketStatu";
import BarchartComponent from "../BarchartComponent/BarchartComponent";
import LineChartComponent from "../LineChartComponent/LineChartComponent";
import TicketCard from "../../../../../components/DashboardComponents/AdminDashboardComponents/TicketCard/TicketCard";
import ServiceRequestBarChart from "../ServiceRequestBarChart/ServiceRequestBarChart";
import TicketCountBarChart from "../TicketCountBarChart/TicketCountBarChart";

const AdminDashboard = () => {
  return (
    <div className="font-poppins w-full">
      <div className="mb-4 flex gap-4 md:flex-row flex-col">
        <TicketCard count="" type="" progress="" icon="" />
        <TicketCard count="" type="" progress="" icon="" />
        <TicketCard count="" type="" progress="" icon="" />
      </div>
      {/* today status ticket status */}
      <div className=" flex min-h-[300px]">
        <PieChartTicketStatu />
      </div>
      <div className="mt-2">
        <BarchartComponent />
      </div>
      <div className="mt-2">
        <LineChartComponent />
      </div>
      <div className="mt-2">
        <ServiceRequestBarChart />
      </div>
      <div className="mt-2">
        <TicketCountBarChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
