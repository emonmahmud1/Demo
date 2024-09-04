import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import { nameValidation } from "../../../utilities/validation";
import axiosClient from "../../../config/axiosConfig";
import { useContext } from "react";
import { UserContext } from "../../routes/PrivateRoute/PrivateRoute";

const UpdatePassword = () => {
  const user = useContext(UserContext);
  // console.log(user?.employee_id);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);

    axiosClient(true)
      .put("/users/change", data)
      .then((res) => {
        console.log(res, "pass change res");
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Password"
        placeholder="******"
        type="password"
        name="password"
        register={register("password", nameValidation.password)}
        error={errors.password}
        required={true}
      />
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
      <SubmitBtn name="Update Password" />
    </form>
  );
};

export default UpdatePassword;
