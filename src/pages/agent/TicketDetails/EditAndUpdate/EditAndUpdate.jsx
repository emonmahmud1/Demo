import { useForm } from "react-hook-form";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";

const EditAndUpdate = ({ data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data, "from edit and update");
  };
  return (
    <>
      <div className="mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-rows-5 grid-cols-12 gap-5"
        >
          <div className="dark:bg-[#1F8685] row-span-2 col-span-12 md:col-span-6 border border-[#1F8685] p-2 rounded-lg bg-[#FFFFFF]">
            <h2 className="text-base dark:text-[#CDE7E7] text-[#1F8685] font-medium ">
              Personal Details
            </h2>
            <table className=" dark:bg-[#0F3333] dark:text-[#CDE7E7]  border-separate border-spacing-1 text-sm text-[#4B4B4B]  text-left w-full table">
              <tbody>
                <tr className="w-[30%]">
                  <th className="">Name</th>
                  <td>
                    <InputField
                      name="name"
                      register={register}
                      error={errors.name}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Address</th>
                  <td>
                    <InputField
                      name="address"
                      register={register}
                      error={errors.address}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Phone Number</th>
                  <td>
                    <InputField
                      name="phoneNumber"
                      register={register}
                      error={errors.phoneNumber}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Alternate Number</th>
                  <td>
                    <InputField
                      name="altPhoneNumber"
                      register={register}
                      error={errors.altPhoneNumber}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Registered Phone Number</th>
                  <td>
                    <InputField
                      name="regPhoneNumber"
                      register={register}
                      error={errors.regPhoneNumber}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className=" row-span-3 dark:bg-[#1F8685] col-span-12 md:col-span-6 border border-[#1F8685] p-2 rounded-lg bg-[#FFFFFF]">
            <h2 className="text-base dark:text-[#CDE7E7] text-[#1F8685] font-medium ">
              Product Details
            </h2>
            <table className="dark:text-[#CDE7E7] dark:bg-[#0F3333] border-separate border-spacing-1 text-sm text-[#4B4B4B]  text-left w-full table">
              <tbody>
                <tr className="">
                  <th className="">Vehicle Registration Number</th>
                  <td>
                    <InputField
                      name="vehicleRegNumber"
                      register={register}
                      error={errors.vehicle_reg_number}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Engine Number</th>
                  <td>
                    <InputField
                      name="engine_number"
                      register={register}
                      error={errors.engine_number}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Odometer Reading (Kms)</th>
                  <td>
                    <InputField
                      name="odometer_reading"
                      register={register}
                      error={errors.odometer_reading}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Chasis Number</th>
                  <td>
                    <InputField
                      name="chasis_number"
                      register={register}
                      error={errors.chasis_number}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Last Servicing Date</th>
                  <td>
                    <InputField
                      name="servicing_date"
                      register={register}
                      error={errors.servicing_date}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Servicing Count</th>
                  <td>
                    <InputField
                      name="servicing_count"
                      register={register}
                      error={errors.servicing_count}
                    />
                  </td>
                </tr>
                <tr className="">
                  <th>Warranty Status</th>
                  <td>
                    <InputField
                      name="warranty_status"
                      register={register}
                      error={errors.warranty_status}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

    <SubmitBtn name="Reopen Ticket" />
              
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAndUpdate;
