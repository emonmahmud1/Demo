import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import axiosClient, { fetcher } from "../../../../../config/axiosConfig";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitBtn from "../../../../../components/SubmitBtn/SubmitBtn";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../routes/PrivateRoute/PrivateRoute";

const UserPermissionUpdate = ({setShowPermission}) => {

    const {id}= useParams()
    const userId =parseInt(id)
    // console.log('user parmission')
    const {data:userPermissionsData}=useSWR(`users/${id}`,fetcher)

    const givenPermissions = userPermissionsData?.data?.permissions_list
    // console.log(givenPermissions,'given perimissions..............')

    const {
        handleSubmit,
        formState: { errors, isValid },
      } = useForm();

  const [selectedTags, setSelectedTags] = useState(givenPermissions? givenPermissions : []);
  const [suggestions, setSuggestions] = useState([]);

  const selectedPermissionId = selectedTags?.map((item) => {
    return item.id;
  });
  console.log(selectedPermissionId,'selected ids.................................')

  // get user role from api
  const { data: userRoleData,isLoading } = useSWR("permissions", fetcher);
  const userRole = userRoleData?.data;
  // console.log(userRole);

  useEffect(() => {
    setSuggestions(userRole);
  }, [userRole]);

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedRole = suggestions.find(
      (role) => role.id.toString() === selectedId
    );
    if (
      selectedRole &&
      !selectedTags.some((tag) => tag.id === selectedRole.id)
    ) {
      setSelectedTags([
        ...selectedTags,
        { id: selectedRole.id, name: selectedRole.name },
      ]);
    }
  };

  const closeModal = () => {
    setShowPermission(false);
  };

  const removeTag = (tagIdToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagIdToRemove));
  };
  const filteredSuggestions = suggestions?.filter(
    (suggestion) => !selectedTags.some((tag) => tag.id === suggestion.id)
  );

  // console.log(filteredSuggestions, "filteredSuggestions");
  const onSubmit = () => {
    console.log(selectedPermissionId, "submit tags..................");
    const newData = {
      user_id: userId,
      permissions_list: selectedPermissionId,
    };
    console.log(newData, "submit tags confirm..................");

    if (newData) {
      axiosClient(false)
        .post("/permissions-user", newData)
        .then((res) => {
          console.log(res);

          if (res?.status === 400) {
            toast.error("error 400");
          }

          toast.success("successfully upadated roles");
        })
        .catch((err) => {
          toast.error(`${err.message}`);
          toast.error(err.response.data.message);
          console.log(err);
        });
    }
  };

  // end modal
  return (
    <dialog
      id="my_modal_1"
      className="modal overflow-hidden backdrop-blur rounded-md bg-white/20"
      open
    >
      <div className="modal-box shadow-lg bg-gray-300">
        <button
          onClick={closeModal}
          className="btn btn-sm btn-circle btn-ghost right-2 top-2 fixed"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Assign User Permissions</h3>
          <div className="mb-4 min-h-11 rounded-lg p-1 border flex gap-2  flex-wrap">
            {selectedTags.map((tag,idx) => (
              <span
                key={idx}
                className="tag bg-gray-gray4 rounded-md p-1 text-gray-gray1  "
              >
                {tag.name}
                <button
                  className="hover:text-red-500 ml-1 text-lg"
                  onClick={() => removeTag(tag.id)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <select
            className="select dark:bg-[#2d7a7a] bg-[#c8ecec] text-black select-bordered w-full border border-primary-light mb-3"
            onChange={handleSelect}
          >
            <option value="">Select </option>
            {suggestions &&
              Array.isArray(filteredSuggestions) &&
              filteredSuggestions?.map((item, idx) => {
                // console.log(item.name)
                return (
                  <option key={idx} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
          </select>
          <SubmitBtn name="Assign Permission" />
        </form>
      </div>
    </dialog>
  );
};

export default UserPermissionUpdate;
