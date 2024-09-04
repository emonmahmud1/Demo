import moment from "moment";
import Table from "../../../../components/Table.jsx/Table";
import { handleDelete } from "../../../../utilities/handleDelete";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import { fetcher } from "../../../../config/axiosConfig";

const UserList = () => {
  const { data: users, mutate } = useSWR("/users",fetcher);
  const userList = users ? users.data : [];

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
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Phone",
      accessorKey: "phone_number",
    },
    {
      header: "Birth Date",
      accessorKey: "date_of_birth",
      cell: ({ row }) => moment(row.original.date_of_birth).format("DD MMM Y"),
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: ({ row }) => moment(row.original.updated_at).format("DD MMM Y"),
    },
   
  ];
  return (
    <>
      {/* <Heading headingName="Users List" /> */}
      <Helmet>
        <title>Users</title>
      </Helmet>
      {userList && (
        <Table
          columns={columns}
          data={userList}
          handleDelete={(id) => handleDelete(mutate, `/users/${id}`)}
          tableName="User List"
          path="add-new-user"
        />
      )}
    </>
  );
};

export default UserList;
