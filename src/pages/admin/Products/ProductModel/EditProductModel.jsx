import { useParams } from "react-router-dom";
import EditLayout from "../../../../components/EditLayout/EditLayout";
import { useForm } from "react-hook-form";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";
import Swal from "sweetalert2";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import { nameValidation } from "../../../../utilities/validation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";

const EditProductModel = () => {
  const { id } = useParams();
  const mId = parseInt(id);

  const {
    register,
    handleSubmit,
    setError,
    setValue,

    formState: { errors },
  } = useForm();
  const [productId, setProductId] = useState(null);
  const { data: productModelData, error } = useSWR(
    `/product_models/${id}`,
    fetcher
  );
  const product_Models = productModelData?.data?.[0];

  const { data: products } = useSWR(product_Models && "products", fetcher);
  const { data: singleProducts } = useSWR(product_Models && `products/${product_Models.product_id}`, fetcher);
  // console.log(singleProducts?.data?.[0]?.name);
  useEffect(() => {
    setProductId(product_Models?.product_id);
    setValue("name", product_Models?.name);
    // setValue("product_name", singleProducts?.data?.[0]?.name);
    setValue("product_name", product_Models?.product_name);
  }, [product_Models, products,singleProducts]);

  const onSubmit = (data) => {
    console.log(data);
    const newData = { ...data, product_id: productId, id: mId };
    console.log(newData);

    axiosClient(false)
      .put(`/product_models?=id${id}`, newData)
      .then((res) => {
        // console.log(res)
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
            // window(document.location.reload());
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //reset();
  };

  const handleProductId = (e) => {
    setProductId(e.id);
  };

  return (
    <EditLayout headingName="Product Model Edit">
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className="border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <SelectComponent
                placeholder="Product"
                register={register}
                name="product_name"
                selectArr={products?.data}
                handleProductId={handleProductId}
                error={errors.name}
                required={true}
              />
            </div>
            <div>
              <InputField
                label="Product Model Name"
                placeholder="Enter model name"
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

export default EditProductModel;
