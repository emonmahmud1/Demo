import { useForm } from "react-hook-form";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";
import EditLayout from "../../../../components/EditLayout/EditLayout";
import { useParams } from "react-router-dom";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import { nameValidation } from "../../../../utilities/validation";
import useSWR from "swr";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProductVariant = () => {
  const { id } = useParams();
  const vId = parseInt(id);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();
  const [productId, setProductId] = useState(null);
  const [productModelId, setProductModelId] = useState(null);
  // console.log(productId, "p id state............");

  const { data: productVariantData, error } = useSWR(
    `/product_model_variants/${id}`,
    fetcher
  );
  const product_variant = productVariantData?.data?.[0];

  const { data: productData, error: productError } = useSWR(
    "/products",
    fetcher
  );

  const { data: singleProductData } = useSWR(
    product_variant && `/products/${product_variant?.product_id}`,
    fetcher
  );

  const { data: productModelData, error: modelError } = useSWR(
    productId ? `/product_models?product_id=${productId}` : null,
    fetcher
  );
  // console.log(productModelData?.data, "all product model data");

  const { data: singleProductModelData } = useSWR(
    product_variant && `/product_models/${product_variant?.product_model_id}`,
    fetcher
  );
  // console.log(singleProductModelData?.data?.[0]?.name, "single product model data...........");

  useEffect(() => {
    if (product_variant) {
      setValue("name", product_variant.name);
      setProductId(product_variant?.product_id);
      setProductModelId(product_variant.product_model_id);
    }

    // if (singleProductData) {
    //   setValue("product_name", singleProductData?.data?.[0]?.name);
    // }

  
      setValue("product_name", product_variant?.product_name);
      setValue("model_name", product_variant?.product_model_name);
    
  }, [product_variant, singleProductData,singleProductModelData]);

  // useEffect(() => {
  //   setValue("model_name", singleProductModelData?.data?.[0]?.name);
  // }, [singleProductModelData]);

  const onSubmit = (data) => {
    const name = data?.name;
    const newData = {
      name,
      product_id: productId,
      product_model_id: productModelId,
      id: vId,
    };
    // console.log(newData, "submited data");

    axiosClient(false)
      .put(`/product_model_variants?id=${id}`, newData)
      .then((res) => {
        console.log(res?.data);
        if (res?.data.status === 400) {
          toast.error(res?.data.message);
          if (res?.data.data.name) {
            setError("name", {
              type: "custom",
              message: res?.data.data.name,
            });
          }
          if (res?.data.data.product_id) {
            setError("product_name", {
              type: "custom",
              message: res?.data.data.product_id,
            });
          }
          if (res?.data.data.product_model_id) {
            setError("model_name", {
              type: "custom",
              message: res?.data.data.product_model_id,
            });
          }
          return;
        }

        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleProductId = (e) => {
    // console.log(e.id, "product id selected");
    setProductId(e.id);
  };

  const handleProductModelId = (e) => {
    setProductModelId(e.id);
  };

  return (
    <EditLayout headingName="Product Variant Edit">
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className="border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <SelectComponent
                placeholder="Product Name"
                register={register}
                name="product_name"
                selectArr={productData?.data}
                handleProductId={handleProductId}
                error={errors.product_name}
              />
            </div>
            <div>
              {singleProductModelData && (
                <SelectComponent
                  placeholder="Product Model"
                  register={register}
                  name="model_name"
                  handleProductModelId={handleProductModelId}
                  selectArr={productModelData?.data}
                  error={errors.model_name}
                />
              )}
            </div>
            <div>
              <InputField
                label="Product Variant Name"
                placeholder="Enter variant name"
                type="text"
                name="name"
                bgcolor="#C1E3D6"
                register={register("name", nameValidation.name)}
                error={errors.name}
                required={true}
              />
            </div>
            <SubmitBtn name="Save Your Edit" />
          </form>
        </div>
      </div>
    </EditLayout>
  );
};

export default EditProductVariant;
