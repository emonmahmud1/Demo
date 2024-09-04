import moment from "moment";
import Table from "../../../components/Table.jsx/Table";

import { handleDelete } from "../../../utilities/handleDelete";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import { fetcher } from "../../../config/axiosConfig";

const CallSubCategory = () => {
  // const { data, error, isLoading } = useSWR("/call_sub_categories", fetcher);
  // const { data ,mutate} = getDataFromApi(`/call_sub_categories`);
  const { data ,mutate} = useSWR(`/call_sub_categories`,fetcher);
  // console.log(data);
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
      header: "Name Bn",
      accessorKey: "name_bn",
    },
    {
      header: "Call Type Name",
      accessorKey: "call_type_name",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Ticket Count",
      accessorKey: "ticket_count",
    },
    {
      header: "Category Name",
      accessorKey: "call_category_name",
    },
  
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: ({ row }) => moment(row.original.value).format("DD MMM YY"),
    },
  ];

  return (
    <>
    <Helmet>
        <title>Call Sub Categories</title>
      </Helmet>
      {data && (
        <Table
          columns={columns}
          data={data?.data}
          handleDelete={(id) => handleDelete(mutate,`call_sub_categories/${id}`)}
          tableName="Call Sub Category"
          path="add-new-call-subcategory"
        />
      )}
    </>
  );
};

export default CallSubCategory;
