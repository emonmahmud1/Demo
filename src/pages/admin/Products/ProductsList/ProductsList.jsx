import useSWR from "swr";
import { fetcher } from "../../../../config/axiosConfig";
import Table from "../../../../components/Table.jsx/Table";
import { handleDelete } from "../../../../utilities/handleDelete";

const ProductsList = () => {
  const { data, error, isLoading, mutate } = useSWR("products", fetcher);
  console.log(data?.data, "from products list");

  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Product Name",
      accessorKey: "name",
    },
  ];
  return (
    <>
      <div className="max-w-[700px] mx-auto">
        {data && (
          <Table
            columns={columns}
            data={data?.data}
            handleDelete={(id) => handleDelete(mutate, `/products/${id}`)}
            path="/dashboard/admin/products/add-product"
            tableName="Product List"
          />
        )}
      </div>
    </>
  );
};

export default ProductsList;
