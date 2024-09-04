import moment from "moment";
import Table from "../../../components/Table.jsx/Table";
import { handleDelete } from "../../../utilities/handleDelete";
import getDataFromApi from "../../../utilities/getDataFromApi";
import TableSkeleton from "../../../components/Skeleton/TableSkeleton";
import { Helmet } from "react-helmet";
import { fetcher } from "../../../config/axiosConfig";
import useSWR from "swr";

const CallCategory = () => {
  // const { data, isLoading,mutate } = getDataFromApi("/call_categories");
  const { data, isLoading,mutate } = useSWR("/call_categories",fetcher);
  console.log(data)

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
      header: "Sub Category Count",
      accessorKey: "call_sub_category_count",
    },
    // {
    //   header: "Created At",
    //   accessorKey: "created_at",
    //   cell: ({ row }) => moment(row.original.value).format("DD MMM YY"),
    // },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: ({ row }) => moment(row.original.value).format("DD MMM YY"),
    },
  
  ];
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
    <Helmet>
        <title>Call Categories</title>
      </Helmet>
      {data && (
        <Table
          columns={columns}
          data={data?.data}
          handleDelete={(id) => handleDelete(mutate,`/call_categories/${id}`)}
          tableName="Call Category"
          path="add-new-call-category"
        />
      )}
    </>
  );
};

export default CallCategory;
