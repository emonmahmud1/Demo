import { useForm } from "react-hook-form";
import InputField from "../../../../../components/InputField/InputField";
import SelectComponent from "../../../../../components/SelectComponent/SelectComponent";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import SubmitBtn from "../../../../../components/SubmitBtn/SubmitBtn";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient, { fetcher } from "../../../../../config/axiosConfig";
import AddLayout from "../../../../../components/AddLayout/AddLayout";
import { nameValidation } from "../../../../../utilities/validation";
import toast from "react-hot-toast";
import useSWR from "swr";

const UpdatePersonalDetails = () => {
  const { id } = useParams();
  const userId = parseInt(id);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,

    formState: { errors, isValid, isLoading },
  } = useForm();
  const navigate = useNavigate();
  const [departmentId, setDepartmentId] = useState(null);
  // console.log(departmentId);
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useSWR(id && `users/${id}`, fetcher);

  const { data: department } = useSWR("departments", fetcher);
  const departmentArr = (department && department.data) || [];
  const handleDepartmentId = (e) => {
    console.log(e.id);
    setDepartmentId(e.id);
  };

  const { data: oneDepartment } = useSWR(
    userData && `departments/${userData?.data.department_id}`,
    fetcher
  );
  const departmentName = oneDepartment?.data?.[0]?.name;
  // console.log(departmentName);

  //   console.log(departmentArr);
  const [dob, setDob] = useState(new Date());
  const newDob = moment(dob).format("YYYY-MM-DD");
  useEffect(() => {
    setDepartmentId(userData?.data.department_id);
  }, [userData]);

  
  useEffect(() => {
    setValue("department_id", departmentName);
    setValue("name", userData?.data?.name);
    setValue("phone_number", userData?.data?.phone_number);
    setValue("email", userData?.data?.email);
    setValue("address", userData?.data?.address);
    setValue("gender", userData?.data?.gender);
    setValue("date_of_birth", userData?.data?.date_of_birth);
  }, [departmentName, userData, setValue]);
  const onSubmit = (data) => {
    const newData = {
      ...data,
      date_of_birth: newDob,
      department_id: departmentId,
      employee_id: userId,
    };
    console.log(newData);
    if (newData) {
      axiosClient(false)
        .put("/users", newData)
        .then((res) => {
          console.log(res);

          if (res?.data.status === 400) {
            toast.error(`${res?.data.message}`);
            if (res?.data.data.name) {
              setError("email", {
                type: "custom",
                message: `${res?.data.data.email}`,
              });
            }
            return;
          }

          toast.success("successfully upadated profile");
        })
        .catch((err) => {
          toast.error(`${err.message}`);
          toast.error(err.response.data.message);
          if (err.response.data.errors.email) {
            setError("email", {
              type: "custom",
              message: `${err.response.data.errors.email[0]}`,
            });
          }
          console.log(err);
        });
    }
  };

  const genderArr = [{ name: "male" }, { name: "female" }];
  return (
    <>
      <AddLayout headingName="Update Profile">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <SelectComponent
            placeholder="Select Department"
            register={register}
            name="department_id"
            selectArr={departmentArr}
            error={errors.department_id}
            handleDepartmentId={handleDepartmentId}
            required={true}
          />{" "}
          <InputField
            placeholder="name"
            label="Name"
            type="text"
            name="name"
            bgcolor="#C1E3D6"
            register={register("name", nameValidation.name)}
            error={errors.name}
            required={true}
          />{" "}
          <InputField
            placeholder="email"
            label="Email"
            type="text"
            name="email"
            bgcolor="#C1E3D6"
            register={register("email", nameValidation.email)}
            error={errors.email}
            required={true}
          />{" "}
          <InputField
            placeholder="phone"
            label="Phone"
            type="text"
            name="phone_number"
            bgcolor="#C1E3D6"
            register={register("phone_number", nameValidation.phone)}
            error={errors.phone_number}
            required={true}
          />{" "}
          <InputField
            placeholder="address"
            label="Address"
            type="text"
            name="address"
            bgcolor="#C1E3D6"
            register={register("address")}
            error={errors.address}
            required={true}
          />{" "}
          <SelectComponent
            placeholder="Select your Gender"
            register={register}
            name="gender"
            selectArr={genderArr}
            error={errors.gender}
            required={true}
          />{" "}
          <label htmlFor="">
            <span className="md:text-[13px] label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm font-semibold">
              Date of Birth
            </span>
            <DatePicker
              className="dark:bg-[#2d7a7a] w-full mt-1 rounded-md pt-2"
              showIcon
              toggleCalendarOnIconClick
              name="date_of_birth"
              selected={dob}
              onChange={(date) => setDob(date)}
              icon="fa fa-calendar"
            />
          </label>
          {/* <table className="table border border-secondary-light bg-[#F0F0F0] dark:bg-bg-dark rounded-2xl overflow-hidden w-full">
          <tbody>
            <tr className="bg-secondary-light text-white text-center dark:bg-bg-dark ">
              <td colSpan="2" className="p-2 border-secondary-light">
                Personal Details
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className="w-1/2">Department Id</td>
              <td className="w-1/2">
                {" "}
                <SelectComponent
                  // placeholder="Product Model Varient id"
                  register={register}
                  name="department_id"
                  selectArr={departmentArr}
                  error={errors.department_id}
                  handleDepartmentId={handleDepartmentId}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300 dark:bg-[#091818]">
              <td className="w-1/2">Name</td>
              <td className="w-1/2">
                {" "}
                <InputField
                  placeholder="name"
                  label="name"
                  type="text"
                  name="name"
                  bgcolor="#C1E3D6"
                  register={register}
                  error={errors.name}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className=" w-1/2">Email</td>
              <td className=" w-1/2">
                {" "}
                <InputField
                  placeholder="email"
                  label="Email"
                  type="text"
                  name="email"
                  bgcolor="#C1E3D6"
                  register={register}
                  error={errors.email}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className=" w-1/2">Phone Number</td>
              <td className=" w-1/2">
                {" "}
                <InputField
                  placeholder="phone"
                  label="Phone"
                  type="text"
                  name="phone_number"
                  bgcolor="#C1E3D6"
                  register={register}
                  error={errors.phone_number}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className=" w-1/2">Address</td>
              <td className=" w-1/2">
                {" "}
                <InputField
                  placeholder="address"
                  label="Address"
                  type="text"
                  name="address"
                  bgcolor="#C1E3D6"
                  register={register}
                  error={errors.address}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className="w-1/2">Gender</td>
              <td className="w-1/2">
                {" "}
                <SelectComponent
                  // placeholder="Product Model Varient id"
                  register={register}
                  name="gender"
                  selectArr={genderArr}
                  error={errors.gender}
                  required={true}
                />
              </td>
            </tr>
            <tr className="bg-slate-300  dark:bg-[#091818]">
              <td className="w-1/2">DoB</td>
              <td className="w-1/2">
                {" "}
                <DatePicker
                  className="dark:bg-[#2d7a7a] w-full mt-1 pt-2"
                  showIcon
                  toggleCalendarOnIconClick
                  selected={dob}
                  onChange={(date) => setDob(date)}
                  icon="fa fa-calendar"
                />
              </td>
            </tr>
          </tbody>
        </table> */}
          <SubmitBtn name="Update" isValid={isValid} isLoading={isLoading} />
        </form>
      </AddLayout>
    </>
  );
};

export default UpdatePersonalDetails;
