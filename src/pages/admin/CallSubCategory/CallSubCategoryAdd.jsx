import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";

import axiosClient, { fetcher } from "../../../config/axiosConfig";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import getDataFromApi from "../../../utilities/getDataFromApi";
import AddLayout from "../../../components/AddLayout/AddLayout";
import { UserContext } from "../../routes/PrivateRoute/PrivateRoute";
import { nameValidation } from "../../../utilities/validation";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import useSWR from "swr";

const CallSubCategoryAdd = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm();
  const { department_id } = useContext(UserContext);

  const [callTypeId, setCallTypeId] = useState();
  const [smtpId, setSmtpId] = useState();

  const { data: callTypeData, error: callTypeError } =
    useSWR("/call_types",fetcher);
  const callType = callTypeData ? callTypeData.data : [];


  const { data: callCategoryData, error: categoryError } = useSWR(
    callTypeId ? `call_categories?call_type_id=${callTypeId}` : null,fetcher
  );
  const callCategory = callCategoryData ? callCategoryData.data : [];
 
  const { data: smtpData, error: smtpError } = useSWR("s_m_t_p_s",fetcher);
  const smtp = smtpData ? smtpData.data : [];

  const handleCallTypeId = (selectedOption) => {
    setCallTypeId(selectedOption.id);
  };
  const handleSmtpId = (smtpselectedOption) => {
    setSmtpId(smtpselectedOption.id);
  };

  const onSubmit = (data) => {
    // console.log(data)
    const name = data?.name;
    const name_bn = data?.name_bn;
    const callTypeId = callType.find(
      (item) => item.name === data.call_type_name
    );
    // console.log(callTypeId);
    const callCategoryId = callCategory.find(
      (item) => item.name === data.call_category_name
    );
    // console.log(callCategoryId)

    if (callTypeId && callCategoryId) {
      const newData = {
        name,
        name_bn,
        call_type_id: callTypeId.id,
        call_category_id: callCategoryId.id,
        department_id,
        s_m_t_p_id: smtpId, //smtp id
        to_list: sentEmailTags,
        cc: ccEmailTags,
        bcc: ccEmailTags,
      };
      console.log(newData);

      axiosClient(false)
        .post("/call_sub_categories", newData)
        .then((res) => {
          console.log(res?.data.data);
          if (res?.data.status === 400) {
            toast.error(`${(res?.data.message)}`);
            if (res?.data.data.name) {
              setError("name", {
                type: "custom",
                message: `${res?.data.data.name}`,
              });
            }
            if (res?.data.data.name_bn) {
              setError("name_bn", {
                type: "custom",
                message: `${res?.data.data.name_bn}`,
              });
            }
            if (res?.data.data.s_m_t_p_id) {
              setError("s_m_t_p_id", {
                type: "custom",
                message: `${res?.data.data.s_m_t_p_id}`,
              });
            }
            return;
          }
  
          toast.success(`${res.data.message}`);
         navigate(-1)
          return;
        })
        .catch((err) => {
          toast.error("An error occurred. Please try again.");
        });
    }
  };

  // send email list
  const [sentEmailTags, setSentEmailTags] = useState([]);
  const [inputValueSentEmail, setInputValueSentEmail] = useState("");
  // console.log(inputValue,"input value")
  // console.log(tags,"tags")

  const handleKeyDownToList = (e) => {
    if (e.key === "Enter" && inputValueSentEmail.trim() !== "") {
      e.preventDefault();

      setSentEmailTags([...sentEmailTags, inputValueSentEmail.trim()]);

      setInputValueSentEmail("");
    }
  };

  const handleRemoveTagToList = (tagToRemove, e) => {
    e.preventDefault();
    console.log(tagToRemove);
    const updatedTags = sentEmailTags.filter((tag) => tag !== tagToRemove);
    setSentEmailTags(updatedTags);
  };

  // cc email list
  const [ccEmailTags, setCcEmailTags] = useState([]);
  const [inputValueCcEmail, setInputValueCcEmail] = useState("");

  const handleKeyDownCc = (e) => {
    if (e.key === "Enter" && inputValueCcEmail.trim() !== "") {
      e.preventDefault();

      setCcEmailTags([...ccEmailTags, inputValueCcEmail.trim()]);

      setInputValueCcEmail("");
    }
  };

  const handleRemoveTagToCc = (tagToRemove, e) => {
    e.preventDefault();
    console.log(tagToRemove);
    const updatedTags = ccEmailTags.filter((tag) => tag !== tagToRemove);
    setCcEmailTags(updatedTags);
  };

  // Bcc email list
  const [bccEmailTags, setBccEmailTags] = useState([]);
  const [inputValueBccEmail, setInputValueBccEmail] = useState("");

  const handleKeyDownBcc = (e) => {
    if (e.key === "Enter" && inputValueBccEmail.trim() !== "") {
      e.preventDefault();

      setBccEmailTags([...bccEmailTags, inputValueBccEmail.trim()]);

      setInputValueBccEmail("");
    }
  };

  const handleRemoveTagToBcc = (tagToRemove, e) => {
    e.preventDefault();
    console.log(tagToRemove);
    const updatedTags = bccEmailTags.filter((tag) => tag !== tagToRemove);
    setBccEmailTags(updatedTags);
  };

  return (
    <AddLayout headingName="Add Call Sub Category">
      <Helmet>
        <title>Add Call Sub Category</title>
      </Helmet>
      {callTypeError && <p>{callTypeError.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <SelectComponent
            placeholder="Call Type"
            register={register}
            name="call_type_name"
            selectArr={callType}
            handleCallTypeId={handleCallTypeId}
            error={errors.call_type_name}
            required={true}
          />
        </div>
        <div>
          <SelectComponent
            placeholder="Call Category"
            name="call_category_name"
            register={register}
            selectArr={callCategory}
            error={errors.call_category_name}
            required={true}
          />
        </div>
        <div>
          <SelectComponent
            placeholder="SMTP"
            name="s_m_t_p_id"
            register={register}
            selectArr={smtp}
            handleSmtpId={handleSmtpId}
            error={errors.s_m_t_p}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Call Sub Category Name"
            placeholder="Enter Call Sub Category Name"
            type="text"
            name="name"
            bgcolor="#C1E3D6"
            register={register("name", nameValidation.name)}
            error={errors.name}
            required={true}
          />
        </div>
        <div>
          <InputField
            label="Call Sub Category Name (bengali)"
            placeholder="Enter Sub Call Category Name (bengali)"
            type="text"
            name="name_bn"
            bgcolor="#C1E3D6"
            register={register("name_bn", nameValidation.name_bn)}
            error={errors.name_bn}
            required={true}
          />
        </div>
        {/* email to send */}
        {/*  */}

        <label>
          <span className="label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
            {" "}
            Email to send
          </span>
          <div className="flex flex-wrap gap-2">
            {sentEmailTags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-md px-2 py-1 flex items-center"
              >
                <span className="text-sm">{tag}</span>
                <button
                  className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                  onClick={(e) => handleRemoveTagToList(tag, e)}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Enter email and press Enter"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              value={inputValueSentEmail}
              // {...register('to_list',(nameValidation.email))}
              onChange={(e) => setInputValueSentEmail(e.target.value)}
              onKeyDown={handleKeyDownToList}
            />
          </div>
        </label>
        {/*  */}

        {/* email cc */}
        {/*  */}

        <label>
          <span className="label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
            {" "}
            Cc Email
          </span>
          <div className="flex flex-wrap gap-2">
            {ccEmailTags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-md px-2 py-1 flex items-center"
              >
                <span className="text-sm">{tag}</span>
                <button
                  className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                  onClick={(e) => handleRemoveTagToCc(tag, e)}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Enter email and press Enter"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              value={inputValueCcEmail}
              onChange={(e) => setInputValueCcEmail(e.target.value)}
              onKeyDown={handleKeyDownCc}
            />
          </div>
        </label>
        {/*  */}

        {/* email Bcc */}
        {/*  */}

        <label>
          <span className="label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
            {" "}
            Bcc Email
          </span>
          <div className="flex flex-wrap gap-2">
            {bccEmailTags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-md px-2 py-1 flex items-center"
              >
                <span className="text-sm">{tag}</span>
                <button
                  className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                  onClick={(e) => handleRemoveTagToBcc(tag, e)}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Enter email and press Enter"
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              value={inputValueBccEmail}
              onChange={(e) => setInputValueBccEmail(e.target.value)}
              onKeyDown={handleKeyDownBcc}
            />
          </div>
        </label>
        {/*  */}

        <SubmitBtn
          isSubmitSuccessful={isSubmitSuccessful}
          isValid={isValid}
          name="Add New Row"
        />
      </form>
    </AddLayout>
  );
};

export default CallSubCategoryAdd;
