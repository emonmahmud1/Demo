import { useState } from "react";
import AddLayout from "../../../components/AddLayout/AddLayout";
import { IoCreateOutline } from "react-icons/io5";
import { RxTrackPrevious } from "react-icons/rx";
import TabButton from "../../../components/TabButton/TabButton";
import UpdatePassword from "../UpdatePassword/UpdatePassword";
import ResetPassword from "../ResetPassword/ResetPassword";

const ChangeUpdatePasswordLayout = () => {
  const [pageName, setPageName] = useState("Update Password");
  const [tab, setTab] = useState("update");
  const tabOnClick = (e) => {
    setTab(e);
    if (e == "update") {
      setPageName("Update Password");
    } else if (e == "reset") {
      setPageName("Reset Password");
    }
  };

  const tabArray = [
    {
      icon: <IoCreateOutline className="text-xl" />,
      tabName: "Update Password",
      onClick: tabOnClick,
      tabValue: "update",
    },
    {
      icon: <RxTrackPrevious className="text-xl" />,
      tabName: "Reset Password",
      onClick: tabOnClick,
      tabValue: "reset",
    },
  ];

  return (
    <>
      {/* <div className="dark:bg-[#091818]  bg-[#E9F3F0] min-h-[calc(100vh-50px)]"> */}
      <AddLayout headingName={pageName}>
        <div className="max-w-[593px] mb-4 mx-auto flex justify-between">
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
        {tab === "update" && <UpdatePassword />}
        {tab === "reset" && <ResetPassword />}
      </AddLayout>
      {/* </div> */}

      {/* <Footer /> */}
    </>
  );
};

export default ChangeUpdatePasswordLayout;
