import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import axiosClient, { fetcher } from "../../../config/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import getDataFromApi from "../../../utilities/getDataFromApi";
import EditLayout from "../../../components/EditLayout/EditLayout";
import { useEffect, useState } from "react";
import { nameValidation } from "../../../utilities/validation";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import useSWR from "swr";

const CallCategoryEdit = () => {
  const { id } = useParams();
  const categoryId = parseInt(id);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,

    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();
  const [callTypeId, setCallTypeId] = useState(null);
  console.log(callTypeId);

  const onSubmit = (data) => {
    console.log(data);
    // const id = categoryId;
    // const call_type_id = callTypeId;
    // const name = data.name;
    // const name_bn = data.name_bn;
    const newData = {
      ...data,
      // call_type_id: callCategory.call_type_id,
      call_type_id: callTypeId,
      id: categoryId,
    };
    console.log(newData);

    axiosClient(false)
      .put(`/call_categories?id=${id}`, newData)
      .then((res) => {
        console.log(res?.data.data);

        if (res?.data.status === 400) {
          toast.error(`${res?.data.message}`);
          if (res?.data.data.name) {
            setError("name", {
              type: "custom",
              message: `${res?.data.data.name}`,
            });
          }
          if (res?.data.data.name_bn) {
            setError("name_bn", {
              type: "custom",
              message: `${res?.data.data.name_bn}`,
            });
          }
          return;
        }

        toast.success(`${res.data.message}`);
       
        return;
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
  };

 
  const { data: callCategoryData, error } = useSWR(
    `/call_categories/${id}`,fetcher
  );
  const callCategory = callCategoryData?.data?.[0];
  // console.log(callCategory?.call_type_id, "call category from 78");

  useEffect(() => {
    setCallTypeId(callCategory?.call_type_id);
  }, [callCategory]);

  
  const { data: callTypeData, error: callTypeError } = useSWR(
    callCategory && `/call_types`,fetcher
  );
  // console.log(callTypeData?.data)

  useEffect(() => {
    setValue("name", callCategory?.name);
    setValue("name_bn", callCategory?.name_bn);
    setValue("call_type_name", callCategory?.call_type_name);
  }, [callCategoryData, callTypeData]);

  const handleCallTypeId = (e) => {
    setCallTypeId(parseInt(e.id));
  };

  return (
    <EditLayout headingName="Call Category Edit">
      <Helmet>
        <title>Update Call Categories</title>
      </Helmet>
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className=" border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <SelectComponent
                placeholder="Call Type"
                register={register}
                name="call_type_name"
                selectArr={callTypeData?.data}
                handleCallTypeId={handleCallTypeId}
                error={errors.call_type_name}
                required={true}
              />
            </div>
            <div>
              <InputField
                label="Call Category Name"
                placeholder="Enter Call Category Name"
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
                label="Call Category Name (bengali)"
                placeholder="Enter Call Category Name B_n"
                type="text"
                name="name_bn"
                bgcolor="#C1E3D6"
                register={register("name_bn", nameValidation.name)}
                error={errors.name_bn}
                required={true}
              />
            </div>
            <SubmitBtn
              isSubmitSuccessful={isSubmitSuccessful}
              isValid={isValid}
              name="Save Your Edit"
            />
          </form>
        </div>
      </div>
    </EditLayout>
  );
};

export default CallCategoryEdit;
