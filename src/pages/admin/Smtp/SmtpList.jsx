import moment from "moment";
import Table from "../../../components/Table.jsx/Table";
import { handleDelete } from "../../../utilities/handleDelete";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import { fetcher } from "../../../config/axiosConfig";

const SmtpList = () => {
    const { data,mutate } = useSWR('s_m_t_p_s',fetcher);
    console.log(data);
    const columns = [
      {
        header: "Id",
        accessorKey: "id",
      },
      {
        header: "Mailer",
        accessorKey: "mail_mailer",
      },
      {
        header: "Host Mail",
        accessorKey: "mail_host",
      },
      {
        header: "Mail Port",
        accessorKey: "mail_port",
      },
      {
        header: "Mail User Name",
        accessorKey: "mail_username",
      },
      {
        header: "Mail Password",
        accessorKey: "mail_password",
      },
      {
        header: "Encryption",
        accessorKey: "mail_encryption",
      },
      {
        header: "Mail From",
        accessorKey: "mail_from_name",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ row }) => moment(row.original.value).format("DD MMM YY"),
      }
    ];
  
    return (
      <>
      <Helmet>
        <title>SMTP list</title>
      </Helmet>
        {data && (
          <Table
            columns={columns}
            data={data?.data}
            handleDelete={(id) => handleDelete(mutate,`s_m_t_p_s/${id}`)}
            tableName="SMTP list"
            path="add-smtp"
            checkbox={false}
          />
        )}
      </>
    );
};

export default SmtpList;
