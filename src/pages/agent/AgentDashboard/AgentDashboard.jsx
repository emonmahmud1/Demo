import { useForm } from "react-hook-form";
import InputField from "../../../../src/components/InputField/InputField";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import TicketCreateAndInfo from "../../agent/TicketCreateAndInfo/TicketCreateAndInfo";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CustomerDetailsForm from "../CustomerDetailsForm/CustomerDetailsForm";

const AgentDashboard = () => {
  const { phone } = useParams();
  // console.log(phone, "phone number calling agent");

  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [searchAccountId, setSearchAccountId] = useState(" ");
  const [searchKey, setSearchkey] = useState(" ");
  const [userInfo, setUserInfo] = useState({});
  const [tab, setTab] = useState(" ");
  const tabOnClick = (e) => {
    setTab(e);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setSearchkey(data);
  };



  useEffect(() => {
    const phoneRegex = /^8801\d*$/;
    if (phoneRegex.test(phone)) {
      setPhoneNumberError("");
    } else {
      setPhoneNumberError("Invalid Phone Number");
    }
  }, [phone]);

  return (
    <>
      <div className="grid font-poppins grid-cols-12 gap-6 mt-5 md:pl-8 md:pr-12 px-4">
        {/* account info */}
        <div className=" col-span-12 lg:col-span-6">
          <div className=" relative flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
            <form
              className=" md:w-3/5 w-full "
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative h-[120px]">
                <InputField
                  textColor="#344BA0"
                  label="Type Phone / Account No"
                  placeholder="Enter Registered Phone/Account No"
                  type="text"
                  name="search"
                  // bgcolor="#EEE"
                  register={register}
                  error={errors.search}
                />
                <button className=" absolute right-0 bottom-[40%] bg-white  rounded-tr-lg rounded-br-lg p-[10px]">
                  <IoSearch className="text-lg text-[#344BA0]" />
                </button>
              </div>
            </form>
            <div className=" md:w-2/5 relative bottom-5">
              <label className="text-[#FF0099] font-medium ">
                IN CALL......
              </label>
              <button className="btn bg-[#FF0099] w-full text-white">
                <FaPhoneAlt />
                {/* {phone && phone ? phone : "No Calls"} */}
                {
                  phone && phoneNumberError? phoneNumberError: phone? phone : "No Calls"
                }
              </button>
            </div>
          </div>
          <div className="min-h-[455px] overflow-auto  px-5 border-2 rounded-xl border-[#1F8685] border-dashed border-spacing-3">
           <CustomerDetailsForm />
           </div>
        
        </div>
        {/* create ticket */}
        <div className="col-span-12 lg:col-span-6 ">
        <TicketCreateAndInfo />
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
