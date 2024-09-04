import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import { nameValidation } from "../../../utilities/validation";
import axiosClient from "../../../config/axiosConfig";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    
    axiosClient(true)
      .put("users/reset", data)
      .then((res) => {
        console.log(res, "pass reset....................");
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="New Password"
        placeholder="******"
        type="password"
        name="new_password"
        register={register("new_password", nameValidation.password)}
        error={errors.new_password}
        required={true}
      />
      <InputField
        label="Confirm Password"
        placeholder="******"
        type="password"
        name="confirm_password"
        register={register("confirm_password", nameValidation.password)}
        error={errors.confirm_password}
        required={true}
      />
      <SubmitBtn name="Reset Password" />
    </form>
  );
};

export default ResetPassword;
