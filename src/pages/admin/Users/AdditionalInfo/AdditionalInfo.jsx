import React from "react";
import Heading from "../../../../components/Heading/Heading";
import moment from "moment";

const AdditionalInfo = ({ info }) => {
  return (
    <>
      <Heading headingName="Additional Information" tabHeading />
      <table className="table border border-secondary-light bg-[#F0F0F0] dark:bg-bg-dark  border-separate rounded-2xl overflow-hidden w-full">
        <tbody>
          {/* <tr className="bg-secondary-light text-white text-center dark:bg-bg-dark border-secondary-light">
            <td colSpan="2" className="p-2 border-secondary-light">
              Personal Details
            </td>
          </tr> */}
          <tr className="bg-slate-300 dark:bg-[#091818]">
            <td className="p-2 w-1/2">User Id</td>
            <td className="p-2 w-1/2">{info?.id}</td>
          </tr>
          <tr className="bg-slate-300  border-secondary-light dark:bg-[#091818]">
            <td className="p-2 w-1/2">Department ID</td>
            <td className="p-2  w-1/2">{info?.department_id}</td>
          </tr>
          <tr className="bg-slate-300  border-secondary-light dark:bg-[#091818]">
            <td className="p-2 w-1/2">Email Verify Status</td>
            <td className="p-2  w-1/2">{info?.email_verified_at}</td>
          </tr>

          <tr className="bg-slate-300  border-secondary-light dark:bg-[#091818]">
            <td className="p-2 w-1/2">User Created</td>
            <td className="p-2  w-1/2">
              {moment(info?.created_at).format("DD MMM Y")}
            </td>
          </tr>
          <tr className="bg-slate-300  border-secondary-light dark:bg-[#091818]">
            <td className="p-2  w-1/2">Total Permisssons</td>
            <td className="p-2  w-1/2">
              {info?.roles?.[0]?.permissions?.length}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default AdditionalInfo;
