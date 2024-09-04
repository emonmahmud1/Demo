
import TabButton from "../../../components/TabButton/TabButton";
import { IoCreateOutline } from "react-icons/io5";
import { RxTrackPrevious } from "react-icons/rx";
import CreateTicket from "../CreateTicket/CreateTicket";
import PreviousTicketInfo from "../PreviousTicketInfo/PreviousTicketInfo";
import { useState } from "react";
const TicketCreateAndInfo = ({userInfo}) => {

  const [tab, setTab] = useState("createTicket");
  const tabOnClick = (e) => {
    setTab(e);
  };

  const tabArray = [
    {
      icon: <IoCreateOutline className="text-xl" />,
      tabName: "Create Ticket",
      onClick: tabOnClick,
      tabValue: "createTicket",
    },
    {
      icon: <RxTrackPrevious className="text-xl" />,
      tabName: "Previous Ticket Info",
      onClick: tabOnClick,
      tabValue: "previousTicketInfo",
    },
  ];

  return (
    <>
      <div className="  font-poppins rounded-tl-xl rounded-tr-xl  flex flex-col md:flex-row md:justify-between  px-5 py-5 gap-2 dark:bg-[#0F3333] bg-[#E5F6F6] ">
        <label className="flex gap-2 items-center text-base font-medium">
          <span className="text-[#2D8E8D] dark:text-[#CDE7E7]">Name: </span>
          <input type="text" className="input dark:text-white dark:bg-[#256C6C]  bg-white  w-full "  value={userInfo?.name ? userInfo.name : ""} readOnly/>
        </label>
        <label className="flex gap-2 items-center  text-base font-medium">
          <span className="text-[#2D8E8D] dark:text-[#CDE7E7]">Number: </span>
          <input type="text" className="input dark:bg-[#256C6C] dark:text-white bg-white  w-full " value={userInfo?.phone ? userInfo.phone :""} readOnly/>
        </label>
      </div>
      <div className="font-poppins pt-3 pb-7 shadow-md rounded-br-2xl rounded-bl-2xl dark:bg-[#1B5757] bg-white px-3">
        <div className=" mt-3 mb-3 flex flex-row flex-wrap justify-between gap-3 text font-poppins">
          {tabArray?.map((item, index) => (
            <TabButton
              key={index}
              icon={item.icon}
              tabValue={item.tabValue}
              tabName={item.tabName}
              onClick={item.onClick}
              isActiveTab={tab}
            />
          ))}
        </div>

        <div className="h-[410px]">
          {tab == "createTicket" && <CreateTicket />}
          {tab == "previousTicketInfo" && <PreviousTicketInfo />}
        </div>
      </div>
    </>
  );
};

export default TicketCreateAndInfo;
