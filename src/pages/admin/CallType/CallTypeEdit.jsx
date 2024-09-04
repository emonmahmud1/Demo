import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../config/axiosConfig";
import InputField from "../../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";

import getDataFromApi from "../../../utilities/getDataFromApi";
import EditLayout from "../../../components/EditLayout/EditLayout";
import { useEffect } from "react";
import { nameValidation } from "../../../utilities/validation";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";

const CallTypeEdit = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitSuccessful, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const { data, error } = getDataFromApi(`/call_types/${id}`);
  // console.log(error)

  const callType = data?.data?.[0];
  useEffect(() => {
    setValue("name", callType?.name);
    setValue("name_bn", callType?.name_bn);
  }, [data]);

  const handleOnChange = (e) => {
    console.log(e);
  };

  const onSubmit = (data) => {
    console.log(data);
    axiosClient(false)
      .put(`/call_types?id=${id}`, data)
      .then((res) => {
        if (res?.data.status === 400) {
          toast.error(`${(res?.data.message)}`);
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
        // navigate(-1)
        return;
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <EditLayout headingName="Call Type Edit">
      <Helmet>
        <title>Update Call Type</title>
      </Helmet>
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className="border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputField
                label="Call Type Name"
                type="text"
                name="name"
                bgcolor="#C1E3D6"
                register={register("name", nameValidation.name)}
                error={errors.name}
                required={true}
                handleChange={handleOnChange}
              />
            </div>
            <div>
              <InputField
                label="Call Type Name (bengali)"
                type="text"
                name="name_bn"
                bgcolor="#C1E3D6"
                register={register("name_bn", nameValidation.name_bn)}
                error={errors.name_bn}
                required={true}
              />
            </div>
            <SubmitBtn
              isSubmitSuccessful={isSubmitSuccessful}
              isValid={isValid}
              isSubmitting={isSubmitting}
              name="Save Your Edit"
            />
          </form>
        </div>
      </div>
    </EditLayout>
  );
};

export default CallTypeEdit;
