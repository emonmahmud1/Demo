import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";
import AddLayout from "../../../../components/AddLayout/AddLayout";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import Swal from "sweetalert2";
import { nameValidation } from "../../../../utilities/validation";
import useSWR from "swr";
const AddProductModel = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors },
  } = useForm();

  const { data: productData, error } = useSWR("/products",fetcher);
  const products = productData ? productData.data : [];

  const onSubmit = (data) => {
    console.log(data);
    const productId = products.find((item) => item.name === data.product_name);
    if (productId) {
      const newData = { ...data, product_id: productId.id };

      axiosClient(false)
        .post("/product_models", newData)
        .then((res) => {
          if (res?.data.status === 405 || res?.data.status === 400) {
            return setError("name", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          Swal.fire({
            title: "Success",
            text: `${res.data.message}`,
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(-1);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });

      reset();
    }
  };

  return (
    <AddLayout headingName="Add Product Model">
      {error && <p>{error.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <SelectComponent
            placeholder="Product"
            register={register}
            name="product_name"
            selectArr={products}
            error={errors.name}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Product Variant"
            placeholder="Enter Call Category Name"
            type="text"
            name="name"
            bgcolor="#C1E3D6"
            register={register('name',(nameValidation.name))}
            error={errors.name}
            required={true}
          />
        </div>
        <SubmitBtn name="Add Product Model" />
      </form>
    </AddLayout>
  );
};

export default AddProductModel;
