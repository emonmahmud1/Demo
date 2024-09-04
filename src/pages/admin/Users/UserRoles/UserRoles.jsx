import moment from 'moment';
import React from 'react';
import Table from '../../../../components/Table.jsx/Table';

const UserRoles = ({roles}) => {
    const columns = [
        {
          header: "User Id",
          accessorKey: "id",
        },
        {
          header: "User Role",
          accessorKey: "name",
        },
        {
          header: "Guard Name",
          accessorKey: "guard_name",
        },
        {
            header: "User Created At",
            accessorKey: "created_at",
            cell: ({ row }) => moment(row.original.created_at).format("DD MMM Y"),
          },
      ];
      return (
        <div>
          {roles && (
            <Table
              columns={columns}
              data={roles}
              notView
              tableName="All Roles"
             
            />
          )}
        </div>
      );
};

export default UserRoles;