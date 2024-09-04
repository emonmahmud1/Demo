import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import axiosClient, { fetcher } from "../../../config/axiosConfig";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import AddLayout from "../../../components/AddLayout/AddLayout";
import { nameValidation } from "../../../utilities/validation";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import useSWR from "swr";

const CallcategoryAdd = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();

  const { data: callTypeData } = useSWR("/call_types",fetcher);
  const callType = callTypeData ? callTypeData.data : [];

  const onSubmit = (data) => {
    // console.log(data);
    const callTypeId = callType.find(
      (item) => item.name === data.call_type_name
    );
    if (callTypeId) {
      const newData = { ...data, call_type_id: callTypeId.id };

      axiosClient(false)
        .post("/call_categories", newData)
        .then((res) => {
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
          navigate(-1);
          return;
        })
        .catch((err) => {
          toast.error("An error occurred. Please try again.");
        });
    }
  };

  return (
    <AddLayout headingName="Add Call Category">
      <Helmet>
        <title>Add Call Category</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <SelectComponent
            placeholder="Call Type"
            register={register}
            name="call_type_name"
            selectArr={callType}
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
            label="Call Category Name (Bengali)"
            placeholder="Enter Call Category Name (Bengali)"
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
          name="Add New Row"
        />
      </form>
    </AddLayout>
  );
};

export default CallcategoryAdd;
