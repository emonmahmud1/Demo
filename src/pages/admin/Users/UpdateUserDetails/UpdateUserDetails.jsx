import { useDropzone } from "react-dropzone";
import BackButton from "../../../../components/BackButton/BackButton";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userProfileBg from "../../../../assets/images/userProfileBg.png";
import UpdatePersonalDetails from "./UpdatePersonalDetails/UpdatePersonalDetails";
import useSWR from "swr";
import axiosClient, { fetcher } from "../../../../config/axiosConfig";
import { useForm } from "react-hook-form";
import SubmitBtn from "../../../../components/SubmitBtn/SubmitBtn";
import toast from "react-hot-toast";
import UserPermissionUpdate from "./UserPermissionUpdate/UserPermissionUpdate";
import UserRolesUpdate from "./UserRolesUpdate/UserRolesUpdate";
// import { Tags } from 'react-tagify';

const UpdateDetails = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,

    formState: { errors, isValid },
  } = useForm();
  const { id } = useParams();
  const userId = parseInt(id);
  const { data } = useSWR(`/users/${id}`, fetcher);
  const user = data?.data;
  // console.log(user);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    // console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [showPermission, setShowPermission] = useState(false);
  const handlePermission = () => {
    setShowPermission(!showPermission);
  };
  const [showRole, setShowRole] = useState(false);
  const handleShow = () => {
    setShowRole(!showRole);
  };

  return (
    <>
      <div className="relative min-h-[270px] rounded-md bg-[#1F8685B2]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 rounded-md"
          style={{ backgroundImage: `url(${userProfileBg})` }}
        ></div>
        <div className="relative z-10 p-4">
          <div className="absolute top-3 md:right-4 gap-3 right-2 join items-center justify-center">
            {/*  */}
            <button className="btn btn-sm" onClick={handlePermission}>
              Permissions
            </button>
            <button className="btn btn-sm" onClick={handleShow}>
              Assign role
            </button>
            {/*  */}
            <BackButton />
          </div>

          <div className="hero-content items-center justify-start flex-col lg:flex-row">
            <div
              className="w-[170px] border-gray-500 border-spacing-1 cursor-pointer border-dashed border text-center flex items-center h-[170px] rounded-lg text-black bg-[#FAF3F3] shadow-2xl"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop image here</p>
              ) : (
                <p>
                  Drop image here or{" "}
                  <span className="text-secondary-light hover:text-primary-light">
                    Upload
                  </span>{" "}
                </p>
              )}
            </div>

            <div className="text-secondary-light min-w-[250px] h-[170px] border bg-[#FAF3F3] rounded-lg">
              {user && (
                <div className="p-2 space-y-1">
                  <h1 className="text-2xl font-medium">{user.name}</h1>
                  <p className="border border-secondary-light p-1 rounded-md">
                    {user.email}
                  </p>
                  <p className="border border-secondary-light p-1 rounded-md">
                    {user.phone_number}
                  </p>
                  <p className="border border-secondary-light p-1 rounded-md">
                    {user.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <UpdatePersonalDetails />
      </div>

      {/*  */}

      {showPermission && (
        <UserPermissionUpdate setShowPermission={setShowPermission} />
      )}
      {showRole && <UserRolesUpdate setShowRole={setShowRole} />}

      {/*  */}
    </>
  );
};

export default UpdateDetails;
