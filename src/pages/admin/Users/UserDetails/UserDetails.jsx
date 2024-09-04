import { Link, useParams } from "react-router-dom";
import getDataFromApi from "../../../../utilities/getDataFromApi";
import BackButton from "../../../../components/BackButton/BackButton";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import userProfileBg from "../../../../assets/images/userProfileBg.png";
import { TbEyeClosed } from "react-icons/tb";
import { CgEye } from "react-icons/cg";
import { useState } from "react";
import TabButton from "../../../../components/TabButton/TabButton";
import UserPermissions from "../UserPermissions/UserPermissions";
import moment from "moment";
import UserRoles from "../UserRoles/UserRoles";
import AdditionalInfo from "../AdditionalInfo/AdditionalInfo";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import { fetcher } from "../../../../config/axiosConfig";

const UserDetails = () => {
  const { id } = useParams();

  const { data } = useSWR(`/users/${id}`,fetcher);
  const user = data ? data.data : [];
  console.log(user?.permissions_list)

  const [tab, setTab] = useState("");
  // console.log(tab, "tab value from user details component....................");
  const [show, setShow] = useState();
  // console.log(
  //   show,
  //   "show hide from userDetails component......................"
  // );
  const tabOnClick = (e) => {
    if (tab === e) {
      setShow(!show);
    } else {
      setTab(e);
      setShow(true);
    }
    // console.log(e, "onclick tab value from userDetails component.............");
  };
  const permissonBtn = {
    icon: <CgEye className="text-xl" />,
    cngIcon: <TbEyeClosed className="text-xl" />,
    tabName: "Hide",
    onClick: tabOnClick,
    tabValue: "permission",
    show: show,
  };
  const infoBtn = {
    icon: <CgEye className="text-xl" />,
    cngIcon: <TbEyeClosed className="text-xl" />,
    tabName: "Hide",
    onClick: tabOnClick,
    tabValue: "info",
    show: show,
  };
  const roleBtn = {
    icon: <CgEye className="text-xl" />,
    cngIcon: <TbEyeClosed className="text-xl" />,
    tabName: "Hide",
    onClick: tabOnClick,
    tabValue: "roles",
    show: show,
  };

  return (
    <>
     <Helmet>
        <title>User Details</title>
      </Helmet>
      <div className="relative min-h-[270px] rounded-md bg-[#177a79b3]">
        <div className="absolute z-10 gap-2 top-3 md:right-4 right-2 join items-center justify-center">
          <Link
            className="flex gap-1 items-center btn md:btn-sm btn-xs bg-secondary-light border-none text-white"
            to={`/dashboard/admin/users/edit/${id}`}
          >
            <FaRegEdit />
            Update
          </Link>
          <BackButton />
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 rounded-md"
          style={{ backgroundImage: `url(${userProfileBg})` }}
        ></div>

        <div className="relative p-4">
          <div className="hero-content items-center justify-start flex-col lg:flex-row text-white">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              className="max-w-xs max-h-[200px] rounded-lg border-[#D9D9D9] shadow-2xl"
            />

            <div className=" text-center md:text-start ">
              <h1 className="md:text-2xl text-xl font-bold">{user?.name}</h1>
              <div className="md:text-base text-sm flex flex-wrap gap-5 mt-3">
                <p className="flex items-center gap-2">
                  <HiOutlineMailOpen />
                  {user?.email}
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone />
                  {user?.phone_number}
                </p>
                <p className="flex items-center gap-2">
                  <IoLocationSharp />
                  {user?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 ">
        <table className="table  bg-[#F0F0F0] dark:bg-bg-dark  border-separate rounded-2xl overflow-hidden w-full">
          <tbody>
            <tr className="bg-secondary-light text-white text-center dark:bg-bg-dark border-secondary-light">
              <td colSpan="2" className="p-2 border-secondary-light">
                Personal Details
              </td>
            </tr>
            <tr className="bg-slate-300 dark:bg-[#091818]">
              <td className="p-2 w-1/2">NID Number</td>
              <td className="p-2 w-1/2">{56456}</td>
            </tr>
            <tr className="bg-slate-300 border border-secondary-light dark:bg-[#091818]">
              <td className="p-2 w-1/2">Date of Birth</td>
              <td className="p-2 w-1/2">{moment(user?.date_of_birth).format("DD MMM Y")}</td>
            </tr>
            <tr className="bg-slate-300 border border-secondary-light dark:bg-[#091818]">
              <td className="p-2  w-1/2">Gender</td>
              <td className="p-2  w-1/2">{user?.gender}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 justify-between text-[#344BA0]">
        <div className="flex gap-2 justify-between items-center border border-[#344BA0] rounded-xl max-w-[320px]">
          <p className="ml-2">View All Permission</p>
          <TabButton
            icon={permissonBtn.icon}
            cngIcon={permissonBtn.cngIcon}
            tabValue={permissonBtn.tabValue}
            tabName={permissonBtn.tabName}
            onClick={permissonBtn.onClick}
            isActiveTab={tab}
            show={show}
          />
        </div>
        <div className="flex gap-2 justify-between items-center border border-[#344BA0] rounded-xl max-w-[320px]">
          <p className="ml-2">Additional Information</p>
          <TabButton
            icon={infoBtn.icon}
            cngIcon={infoBtn.cngIcon}
            tabValue={infoBtn.tabValue}
            tabName={infoBtn.tabName}
            onClick={infoBtn.onClick}
            isActiveTab={tab}
            show={show}
          />
        </div>
        <div className="flex gap-2 justify-between items-center border border-[#344BA0] rounded-xl max-w-[320px]">
          <p className="ml-2">View all Role</p>
          <TabButton
            icon={roleBtn.icon}
            cngIcon={roleBtn.cngIcon}
            tabValue={roleBtn.tabValue}
            tabName={roleBtn.tabName}
            onClick={roleBtn.onClick}
            isActiveTab={tab}
            show={show}
          />
        </div>
      </div>
      <div className="mt-4 min-h-10 ">
        {(tab =="permission" && show ==true) && <UserPermissions permission={user?.permissions_list}/>}
        {(tab =="roles" && show ==true) && <UserRoles roles={user?.roles_list}/>}
        {(tab =="info" && show ==true) && <AdditionalInfo info={user && user}/>}

      </div>
    </>
  );
};

export default UserDetails;
