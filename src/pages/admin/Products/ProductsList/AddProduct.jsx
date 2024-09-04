import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../config/axiosConfig";
import Swal from "sweetalert2";
import AddLayout from "../../../../components/AddLayout/AddLayout";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import { nameValidation } from "../../../../utilities/validation";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors,isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    axiosClient(false)
      .post("/products", data)
      .then((res) => {
        if (res?.data.status === 400) {
          return setError("name", {
            type: "custom",
            message: `${res.data.message}`,
          });
        }
        toast.success(`${res.data.message}`)
        navigate(-1)
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
    reset();
  };

  return (
    <AddLayout headingName="Add Product">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            label="Product Name"
            placeholder="Enter Call Type"
            type="text"
            name="name"
            bgcolor="#C1E3D6"
            register={register('name',(nameValidation.name))}
            error={errors.name}
            required={true}
          />
        </div>
        <SubmitBtn isSubmitting={isSubmitting} name="Add New Product" />
      </form>
    </AddLayout>
  );
};

export default AddProduct;
