import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import axiosClient, { fetcher } from "../../../../../config/axiosConfig";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitBtn from "../../../../../components/SubmitBtn/SubmitBtn";
import { useParams } from "react-router-dom";

const UserRolesUpdate = ({ setShowRole }) => {



 


  const { id } = useParams();
  const userId = parseInt(id);
  const {data:userRolesData}=useSWR(`users/${id}`,fetcher)

  const givenRoles = userRolesData?.data?.roles_list
  // console.log(givenRoles,'given roles..............')

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  // modal

  const [selectedTags, setSelectedTags] = useState(givenRoles?givenRoles : []);
  const [suggestions, setSuggestions] = useState([]);

  const selectedRoleId = selectedTags?.map((item) => {
    return item.id;
  });

  // get user role from api
  const { data: userRoleData, error, isLoading } = useSWR("roles", fetcher);
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
    setShowRole(false);
  };

  const removeTag = (tagIdToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagIdToRemove));
  };
  const filteredSuggestions = suggestions?.filter(
    (suggestion) => !selectedTags.some((tag) => tag.id === suggestion.id)
  );

  // console.log(filteredSuggestions, "filteredSuggestions");
  const onSubmit = () => {
    console.log(selectedRoleId, "submit tags..................");
    const newData = {
      user_id: userId,
      roles_list: selectedRoleId,
    };
    console.log(newData, "submit tags confirm..................");

    if (newData) {
      // newData._method = 'PUT';
      axiosClient(false)
        .post("/roles_user", newData)
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
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Assign User Roles</h3>
          <div className="mb-4 min-h-11 rounded-lg p-1 border flex gap-2  flex-wrap">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
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
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
          </select>
          <SubmitBtn name="Assign Role" />
        </form>
      </div>
    </dialog>
  );
};

export default UserRolesUpdate;
