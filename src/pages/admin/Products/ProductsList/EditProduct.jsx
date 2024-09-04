import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputField from "../../../../components/InputField/InputField";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import EditLayout from "../../../../components/EditLayout/EditLayout";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";

import { nameValidation } from "../../../../utilities/validation";
import toast from "react-hot-toast";
import useSWR from "swr";

const EditProduct = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,

    formState: { errors,isSubmitting },
  } = useForm();

  const { data, error,mutate } = useSWR(`/products/${id}`,fetcher);
  const products = data?.data?.[0];
  setValue("name", products?.name);
  const onSubmit = (data) => {
    console.log(data);
    axiosClient(false)
      .put(`/products?id=${id}`, data)
      .then((res) => {
        if ( res?.data.status === 400) {
          return setError("name", {
            type: "custom",
            message: `${res.data.message}`,
          });
        }
      toast.success(`${res.data.message}`)
      mutate()
      })
      .catch((err) => {
      toast.error("error occured")
      });
    
  };

  return (
    <EditLayout headingName="Product Name Edit">
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className="border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputField
                label="Product Name"
                placeholder="Enter product"
                type="text"
                name="name"
                bgcolor="#C1E3D6"
                register={register('name',(nameValidation.name))}
                error={errors.name}
                required={true}
              />
            </div>
            <SubmitBtn isSubmitting={isSubmitting} name="Save Your Edit" />
          </form>
        </div>
      </div>
    </EditLayout>
  );
};

export default EditProduct;
