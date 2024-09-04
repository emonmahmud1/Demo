import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import getDataFromApi from "../../../../utilities/getDataFromApi";
import { useState } from "react";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import InputField from "../../../../components/InputField/InputField";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import AddLayout from "../../../../components/AddLayout/AddLayout";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";
import Swal from "sweetalert2";
import { nameValidation } from "../../../../utilities/validation";
import useSWR from "swr";

const AddProductVariant = () => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
  const [productId, setProductId] = useState();
  console.log(productId)

  const { data: productData ,error:producterror} = useSWR("/products",fetcher);
  const products = productData ? productData.data : []
 
  const { data: productModelData ,error:modelError} = useSWR(productId ? `product_models?product_id=${productId}` : null,fetcher);
  const productModels = productModelData ? productModelData.data : [];
  console.log(productModels,".........models according to product id")


  const handleProductId = (e) => {
    setProductId(e.id);
    console.log(e.id)
  };

  const onSubmit = (data) => {
    console.log(data)
    const name= data?.name;
    const product_id = products.find(
      (item) => item.name === data.product_name
    );
    const product_model_id = productModels.find(
      (item) => item.name === data.model_name
    );
    console.log(product_model_id,"from add product variant///////////////")

    if (product_id && product_model_id) {
      const newData = {
        name,
        product_id:product_id.id,
        product_model_id:product_model_id.id,
      };
      console.log(newData)

      axiosClient(false)
        .post("/product_model_variants", newData)
        .then((res) => {
          console.log(res)
          if(res?.data.status === 400){
            return  setError("name", { type: "custom", message:  `${res.data.message}` });
          }
          Swal.fire({
            title: "Success",
            text: "Your Row has been successfully created.",
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
    <AddLayout headingName="Add Product Variant">
       {producterror && <p>{producterror.message}</p>}
       {modelError && <p>{modelError.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <SelectComponent
                placeholder="Product Name"
                register={register}
                name="product_name"
                selectArr={products}
                handleProductId={handleProductId}
                error={errors.name}
              />
            </div>
            <div>
              <SelectComponent
                placeholder="Product Model"
                register={register}
                name="model_name"
                selectArr={productModels}
                error={errors.name}
              />
            </div>
            <div>
              <InputField
                label="Product Model Variant"
                placeholder="Enter model variant name"
                type="text"
                name="name"
                bgcolor="#C1E3D6"
                register={register('name',(nameValidation.name))}
                error={errors.name}
              />
            </div>
            <SubmitBtn name="Add Product Variant" />
          </form>
    </AddLayout>
  );
};

export default AddProductVariant;