import { useForm } from "react-hook-form";
import Heading from "../../../../components/Heading/Heading";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import { useEffect, useState } from "react";
import Table from "../../../../components/Table.jsx/Table";
import { handleDelete } from "../../../../utilities/handleDelete";
import useSWR from "swr";
import { fetcher } from "../../../../config/axiosConfig";

const ProductModel = () => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
  const [productModel, setProductModel] = useState([]);
  const [productId, setProductId] = useState(null);
  const { data: allProducts } = useSWR("products", fetcher);
  const products = allProducts ? allProducts?.data : [];

  const { data: allProductModel, mutate } = useSWR("product_models", fetcher);

  useEffect(() => {
    setProductModel(allProductModel?.data);
  }, [allProductModel, productModel == undefined]);

  // console.log(productModel, "all product model");

  const handleProductId = (e) => {
    console.log(e.id, "from product model .................");
    setProductId(e.id);
  };

  const { data: productmodelById } = useSWR(
    productId && `product_models?product_id=${productId}`,
    fetcher
  );
  useEffect(() => {
    setProductModel(productmodelById?.data);
    console.log(productmodelById);
  }, [productmodelById]);

  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
  ];

  return (
    <div className="max-w-[760px] mx-auto">
      <Heading headingName="Product Models" />

      <div className="relative min-h-[500px]  rounded-xl mt-5 flex justify-between md:flex-row flex-col gap-5">
        {/* <div className="md:w-1/2 w-full">
          <div className="relative h-[50px] rounded-xl mb-5 bg-[#E5F6F6] dark:text-[#CDE7E7] dark:bg-bg-dark text-[#464F60] font-semibold text-sm">
          <h1 className=" absolute bottom-2 left-2">Product Name</h1>
          </div>
          <div>
            <SelectComponent
              register={register}
              name="product_name"
              selectArr={products}
              handleProductId={handleProductId}
            />
          </div>
        </div> */}
        <div className="  w-full">
          {/* <div className="relative h-[50px] rounded-xl mb-5 dark:text-[#CDE7E7] bg-[#E5F6F6] dark:bg-bg-dark text-[#464F60] font-semibold text-sm">
            <h1 className=" absolute bottom-2 left-2">Product Model</h1>
          </div> */}
          <div>
            <SelectComponent
              register={register}
              name="product_name"
              selectArr={products}
              handleProductId={handleProductId}
            />
          </div>

          <div>
            {productModel && (
              <Table
                columns={columns}
                data={productModel}
                handleDelete={(id) =>
                  handleDelete(mutate, `/product_models/${id}`)
                }
                path="/dashboard/admin/add-product-model"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModel;
