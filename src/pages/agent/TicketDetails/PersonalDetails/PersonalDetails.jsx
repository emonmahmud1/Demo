
const PersonalDetails = ({singleData}) => {
    return (
        <>
        <h2 className="text-base text-[#1F8685] font-medium ">
            Personal Details
          </h2>
          <div className="border dark:bg-[#1F8685] border-[#1F8685] p-2 rounded-lg bg-[#FFFFFF]">
            <table className=" border-separate border-spacing-1 text-sm dark:text-[#CDE7E7] text-[#4B4B4B]  text-left w-full table">
              <tbody className="">
                <tr className="bg-[#F0F0F0] dark:bg-[#0F3333]">
                  <th className="w-[30%]">Name</th>
                  <td>{singleData?.name}</td>
                </tr>
                <tr className="bg-[#F0F0F0] dark:bg-[#0F3333]">
                  <th>Address</th>
                  <td>{singleData?.address}</td>
                </tr>
                <tr className="bg-[#F0F0F0] dark:bg-[#0F3333]">
                  <th>Phone Number</th>
                  <td>{singleData?.phone_number}</td>
                </tr>
                <tr className="bg-[#F0F0F0] dark:bg-[#0F3333]">
                  <th>Alternate Number</th>
                  <td>{singleData?.alt_phone_num}</td>
                </tr>
                <tr className="bg-[#F0F0F0] dark:bg-[#0F3333]">
                  <th>Registered Phone Number</th>
                  <td>{singleData?.reg_phone_num}</td>
                </tr>
              </tbody>
            </table>
          </div>
            
        </>
    );
};

export default PersonalDetails;