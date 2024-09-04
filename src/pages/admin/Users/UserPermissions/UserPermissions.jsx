import Heading from "../../../../components/Heading/Heading";
import Table from "../../../../components/Table.jsx/Table";

const UserPermissions = ({ permission }) => {
  const columns = [
    {
      header: "Permission Id",
      accessorKey: "id",
    },
    {
      header: "Permission Group Id",
      accessorKey: "permission_group_id",
    },
    {
      header: "Permission Name",
      accessorKey: "name",
    },
    {
      header: "Guard Name",
      accessorKey: "guard_name",
    },
  ];
  return (
    <div>
      {permission && (
        <Table
          columns={columns}
          data={permission}
          notView
          //   handleDelete={(id) => handleDelete(`/call_types/id=${id}`)}
          tableName="All Permission"
          //   path="add-new-call-type"
          tabHeading
        />
      )}
    </div>
  );
};

export default UserPermissions;
