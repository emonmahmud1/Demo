import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosClient from "../../../config/axiosConfig";
import Table from "../../../components/Table.jsx/Table";
import moment from "moment";
import getDataFromApi from "../../../utilities/getDataFromApi";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { toast } from "react-toastify";

const PreviousTicketInfo = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  // useEffect(() => {
  //   axiosClient(false)
  //     .get("/call_categories")
  //     .then((response) => {
  //       setData(response.data.data);
  //     });
  // }, []);

  useEffect(() => {
    fetch("../faketicketdata.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsloading(false);
      });
  }, []);
  // const {data,error, isLoading} =getDataFromApi("./faketicketdata.json")
  // console.log(data)

  const columns = [
    {
      header: "Ticket id",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Ticket Status",
      accessorKey: "ticket_status",
    },
    {
      header: "Created Time",
      accessorKey: "create_time",
      cell: ({ value }) => moment(value).format("DD MMM YY"),
    },
  ];

  // const handleDelete = (row) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axiosClient(false)
  //         .delete(`/call-category/${row}`)
  //         .then(() => {
  //           setData((data) => data.filter((item) => item.id !== row));
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "Your file has been deleted.",
  //             icon: "success",
  //           })
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //           Swal.fire({
  //             title: "☹️",
  //             text: "Can't delete this file!",
  //             icon: "error"
  //           });
  //         });

  //     }
  //   });
  // };
  if (isLoading) {
    return <Skeleton />;
  }
  //  else if () {
  //   return toast.error("Data not Loading");
  // }

  return (
    <Table
      columns={columns}
      data={data}
      ticketTable={true}
      // handleDelete={handleDelete}
      //   tableName="Call Category"
    />
  );
};

export default PreviousTicketInfo;
