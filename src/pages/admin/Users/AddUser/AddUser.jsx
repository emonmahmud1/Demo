import { useNavigate } from "react-router-dom";
import AddLayout from "../../../../components/AddLayout/AddLayout";
import InputField from "../../../../components/InputField/InputField";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import { useForm } from "react-hook-form";
import { nameValidation } from "../../../../utilities/validation";
import DatePicker from "react-datepicker";
import { useState } from "react";
import moment from "moment";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";

import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import useSWR from "swr";

const AddUser = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();
  const [deptId, setDeptId] = useState(null);
  const [dob, setDob] = useState(new Date());
  const date_of_birth = moment(dob).format("YYYY-MM-DD");

  const onSubmit = (data) => {
    const newData = { ...data, date_of_birth, department_id: deptId };
    console.log(newData);
    axiosClient(false)
      .post("/register", newData)
      .then((res) => {
        console.log(res?.data);
        if (res?.data.status === 400) {
          toast.error(`${res?.data.message}`);
          if (res?.data.data.name) {
            setError("name", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.name) {
            setError("email", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          return;
        }

        toast.success(`${res.data.message}`);
        navigate(-1)
        return;
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
    
  };

  const handleDepartmentId = (e) => {
    setDeptId(e.id);
  };
  const { data: deparmentData, error } = useSWR("departments",fetcher);
  const departments = deparmentData?.data;
  //   console.log(departments);
  const genderArr = [{ name: "male" }, { name: "female" }];
  return (
    <AddLayout headingName="Add New User">
      <Helmet>
        <title>Add User</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <SelectComponent
            placeholder="Select Department"
            register={register}
            name="department_id"
            selectArr={departments}
            handleDepartmentId={handleDepartmentId}
            error={errors.department_id}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="name"
            placeholder="User Name"
            type="text"
            name="name"
            bgcolor="#C1E3D6"
            register={register("name", nameValidation.name)}
            error={errors.name}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Email"
            placeholder="User Email"
            type="email"
            name="email"
            bgcolor="#C1E3D6"
            register={register("email", nameValidation.email)}
            error={errors.email}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Password"
            placeholder="*****"
            type="password"
            name="password"
            bgcolor="#C1E3D6"
            register={register("password", nameValidation.password)}
            error={errors.password}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Confirm Password"
            placeholder="*****"
            type="password"
            name="password_confirmation"
            bgcolor="#C1E3D6"
            register={register(
              "password_confirmation",
              nameValidation.password
            )}
            error={errors.password_confirmation}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Phone"
            placeholder="Phone Number"
            type="text"
            name="phone_number"
            bgcolor="#C1E3D6"
            register={register("phone_number", nameValidation.phone)}
            error={errors.phone_number}
            required={true}
          />
        </div>
        <div>
          <label className=" my-3 label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
            Dob
            <DatePicker
              className="dark:bg-[#2d7a7a] ml-3 border mb-3 rounded-lg  w-full mt-1 pt-2"
              showIcon
              toggleCalendarOnIconClick
              selected={dob}
              onChange={(date) => setDob(date)}
              name="date"
              //   register={register("phone_number", nameValidation.password)}
              icon="fa fa-calendar"
            />
          </label>
        </div>
        <div>
          <SelectComponent
            placeholder="Select Gender"
            register={register}
            name="gender"
            selectArr={genderArr}
            // handleDepartmentId={handleDepartmentId}
            error={errors.gender}
            required={true}
          />
        </div>
        <div>
          <label>
            <span className=" my-3 label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
              Address
            </span>
            <textarea
              className="textarea w-full resize-none dark:bg-[#1B5757] border-2  border-[#166835]"
              placeholder=""
              {...register("address")}
            />
          </label>
        </div>
        <SubmitBtn
          isSubmitSuccessful={isSubmitSuccessful}
          isValid={isValid}
          name="Add New User"
        />
      </form>
    </AddLayout>
  );
};

export default AddUser;
