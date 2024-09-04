import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import DebouncedInput from "../../components/DebouncedInput/DebouncedInput";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoAddCircleOutline, IoEyeOutline } from "react-icons/io5";

import { RiDeleteBin6Line } from "react-icons/ri";
import AnimationDiv from "../AnimationDiv/AnimationDiv";
import Heading from "../Heading/Heading";

const Table = ({
  data,
  columns,
  tableName,
  handleDelete,
  path,
  ticketTable,
  notView,
  tabHeading = false,
  handleView,
  checkbox = true,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // console.log(data,"from table props")

  const table = useReactTable({
    data,
    columns,

    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter,
    },
  });
  const [selectedRow, setSelectedRow] = useState([]);

  const handleCheckbox = (row, e) => {
    console.log(e.target.checked);
    console.log(row);
    if (e.target.checked) {
      setSelectedRow([...selectedRow, row.original]);
    } else {
      setSelectedRow(selectedRow.filter((item) => item.id !== row.original.id));
    }
  };
  console.log(selectedRow);

  const isChecked = (row) => {
    // console.log("called");
    const selected = selectedRow.some((item) => item.id === row.original.id);
    return selected;
  };

  const checkAll = (headerGroup, e) => {
    console.log(e.target.checked);
    console.log(headerGroup.headers);
    // if (e.target.checked) {
    //   setSelectedRow(headerGroup.headers);
    //   isChecked()
    // }
    // else{
    //   setSelectedRow([])
    // }

    if (e.target.checked) {
      const allRows = table.getRowModel().rows.map((row) => row.original);
      setSelectedRow(allRows);
    } else {
      setSelectedRow([]);
    }
  };

  // const handleDeleteRow = (row) => {
  //   const rowId = row.original.id;
  //   console.log(rowId, "row id from table ..........................");
  //   handleDelete(rowId);

  // };
  const [modalOpen, setModalOpen] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState(null);
  const handleDeleteRow = (row) => {
    setRowIdToDelete(row.original.id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    handleDelete(rowIdToDelete);
    setModalOpen(false);
  };

  return (
    <>
      {/* <AnimationDiv> */}

      {tableName && (
        <div className="flex justify-between items-center md:gap-6 gap-3 mt-3 mb-2 mr-4">
          <div>
            <Heading tabHeading={true} headingName={tableName} />
          </div>
          <div className="flex-1">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(value)}
              className="p-2 text-gray-600 w-full dark:bg-[#1F8685] text-sm shadow-md focus:outline-none border-none focus:ring focus:border-[#344BA0] rounded-lg"
              placeholder="Search Name..."
            />
          </div>

          <div className="">
            {path && (
              <Link
                to={path}
                className=" border shadow-md btn btn-xs  outline-none border-none bg-primary-light text-white"
              >
                <IoAddCircleOutline className="text-2xl" /> Add
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="p-2 flex-grow overflow-x-hidden dark:bg-[#256C6C] bg-[#ddf0f0] rounded-lg ">
        {tableName ? (
          " "
        ) : (
          <div className="flex justify-between gap-8 items-center">
            <div className="flex-1">
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(value)}
                className="p-2 text-white w-1/3 dark:bg-[#1F8685] text-sm shadow-md focus:outline-none border-none focus:ring focus:border-[#344BA0] rounded-md"
                placeholder="Search Name..."
              />
            </div>
            <div className="">
              {path && (
                <Link
                  to={path}
                  className=" border shadow-md btn btn-xs  outline-none border-none bg-primary-light text-white"
                >
                  <IoAddCircleOutline className="text-2xl" /> Add
                </Link>
              )}
            </div>
          </div>
        )}

        <table className="border-collapse table overflow-x-auto mt-2 w-full text-center">
          <thead className="w-full  text-gray-gray3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="" key={headerGroup.id}>
                {handleDelete && checkbox && (
                  <th className="">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="checkbox border-gray-300 checkbox-accent h-4 w-4 rounded-md shadow-md hover:shadow-none"
                        onChange={(e) => checkAll(headerGroup, e)}
                      />
                    </label>
                  </th>
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className=" dark:text-[#CDE7E7]   text-sm px-1 "
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
                {/* {handleDelete && checkbox && <th className="">Edit</th>}
                {handleDelete && checkbox && <th className="">Delete</th>}
                {handleDelete && checkbox && <th className="">View</th>} */}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                className="odd:bg-[#EBF4F4] odd:dark:bg-[#0F3333]"
                key={row.id}
              >
                {handleDelete && checkbox && (
                  <td>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked(row)}
                        className="checkbox  border-gray-300 checkbox-accent h-4 w-4 rounded-md shadow-md hover:shadow-none"
                        onChange={(e) => handleCheckbox(row, e)}
                      />
                    </label>
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td className=" text-sm py-2  px-1" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {handleDelete && (
                  <td className="">
                    <Link to={`edit/${row.original.id}`}>
                      <FaRegEdit className="text-[#344BA0] scale-100 hover:scale-125 hover:drop-shadow-[1px_5px_10px_#344BA0]" />{" "}
                    </Link>
                  </td>
                )}
                {handleDelete && (
                  <td onClick={() => handleDeleteRow(row)}>
                    <RiDeleteBin6Line className="text-[#C11619] hover:drop-shadow-[1px_5px_10px_#C11619]   hover:scale-125 text-lg hover:cursor-pointer" />
                  </td>
                )}
                {notView || (
                  <td>
                    <Link to={`view/${row.original.id}`}>
                      <IoEyeOutline />
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex text-sm items-center gap-2 mt-2  justify-end mr-3">
          <div>
            <select
              className="text-sm dark:bg-[#0F3333] font-inter rounded-md focus:outline-none border-none focus:ring focus:border-[#344BA0]"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option className="" key={pageSize} value={pageSize}>
                  {/* <span className="font-medium text-sm md:text-base"> */}
                  Rows per page:
                  {/* </span>{" "} */}
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <button
            className=" rounded "
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="flex items-center gap-1">
            <strong>
              {table.getState().pagination.pageIndex + 1}/{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <button
            className=" rounded  "
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
        </div>
      </div>
      {/* </AnimationDiv> */}

      {/* modal */}

        {modalOpen && (
          <dialog
            open
            className="modal modal-bottom text-center sm:modal-middle w-full"
            onClose={() => setModalOpen(false)}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Delete!</h3>
              <p className="py-4">Are you sure you want to delete this row?</p>
              <div >
                <form className="modal-action" method="dialog">
                <button
                  onClick={() => setModalOpen(false)}
                  className="btn border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-primary border-none bg-primary-light"
                >
                  Yes, Delete
                </button>
                </form>
              </div>
            </div>
          </dialog>
        )}
   
    </>
  );
};

export default Table;
