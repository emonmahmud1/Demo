import useSWR from "swr";
import Heading from "../../../../components/Heading/Heading";
import SelectComponent from "../../../../components/SelectComponent/SelectComponent";
import Table from "../../../../components/Table.jsx/Table";
import getDataFromApi from "../../../../utilities/getDataFromApi";
import { handleDelete } from "../../../../utilities/handleDelete";
import { fetcher } from "../../../../config/axiosConfig";

const ProductModelVariant = () => {
  const {
    data: variantData,
    error,
    isLoading,
    mutate,
  } = useSWR("/product_model_variants", fetcher);
  console.log(variantData, "variant data..............////");

  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Product Name",
      accessorKey: "product_name",
    },
    {
      header: "Model Name",
      accessorKey: "product_model_name",
    },
   
  ];
  
  return (
    <>
      <div className="max-w-[760px] mx-auto">
        <div>
          {variantData && (
            <Table
              columns={columns}
              data={variantData.data}
              handleDelete={(id) =>
                handleDelete(mutate, `/product_model_variants/${id}`)
              }
              path="/dashboard/admin/add-model-variant"
              tableName="Product Model Variant"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductModelVariant;
