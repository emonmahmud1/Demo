import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";

import axiosClient from "../../../config/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import AddLayout from "../../../components/AddLayout/AddLayout";
import { nameValidation } from "../../../utilities/validation";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
// import SelectComponent from "../../components/SelectComponent/SelectComponent";

const CallTypeAdd = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors, isValid, isSubmitSuccessful, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    axiosClient(false)
      .post("/call_types", data)
      .then((res) => {
         console.log(res?.data.status)
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
        navigate(-1)
        return;
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <AddLayout headingName="Add Call Type">
      <Helmet>
        <title>Add Call Type</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            label="Call Type Name"
            placeholder="Enter Call Type"
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
            label="Call Type Name (bengali)"
            placeholder="Enter Call Type Name (bengali)"
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
          name="Add New Row"
        />
      </form>
    </AddLayout>
  );
};

export default CallTypeAdd;
