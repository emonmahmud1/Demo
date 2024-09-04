import moment from "moment";
import Table from "../../../components/Table.jsx/Table";
import { handleDelete } from "../../../utilities/handleDelete";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { toast } from "react-toastify";
import { fetcher } from "../../../config/axiosConfig";
import { Helmet } from "react-helmet";
import useSWR from "swr";

const CallType = () => {
  const { data, error, isLoading,mutate } = useSWR('/call_types', fetcher);
   console.log(data?.data)
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
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Call Category",
      accessorKey: "call_category_count",
    },
    {
      header: "Sub Category",
      accessorKey: "call_sub_category_count",
    },
    {
      header: "Ticket Count",
      accessorKey: "ticket_count",
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
    }
  ];

  if (isLoading) {
    console.log(isLoading);
    return <Skeleton />;
  }
  if (error) {
    toast.error(error.message);
  }
  return (
    <>
      <Helmet>
        <title>Call Type</title>
      </Helmet>
      {data && (
        <Table
          columns={columns}
          data={data?.data}
          handleDelete={(id) => handleDelete(mutate,`/call_types/${id}`)}
          tableName="Call Type"
          path="add-new-call-type"
        />
      )}
    </>
  );
};

export default CallType;
