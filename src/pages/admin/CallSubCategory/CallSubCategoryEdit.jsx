import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import axiosClient, { fetcher } from "../../../config/axiosConfig";

import { useParams } from "react-router-dom";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import getDataFromApi from "../../../utilities/getDataFromApi";
import EditLayout from "../../../components/EditLayout/EditLayout";
import { useEffect, useState } from "react";
import { nameValidation } from "../../../utilities/validation";

import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import useSWR from "swr";

const CallSubCategoryEdit = () => {
  const { id } = useParams();
  const subCateogoryId = parseInt(id);

  const [callTypeId, setCallTypeId] = useState(null);
  console.log(callTypeId, "type id............");
  const [callCategoryId, setCallCategoryId] = useState(null);
  console.log(callCategoryId, "category id.............");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();
  // const { department_id } = useContext(UserContext);
  // console.log(department_id)

  const {
    data: callSubCategoryData,
    error,
    isLoading: callCatogoriesLoading,
  } = useSWR(`/call_sub_categories/${id}`, fetcher);
  const callSubCategory = callSubCategoryData?.data?.[0];
  // console.log(callSubCategory);

  const [smtpId, setSmtpId] = useState(null);
  console.log(smtpId,"smtp id")

  const { data: callTypeData, error: callTypeError } = useSWR(
    callSubCategory && `/call_types`,
    fetcher
  );

  const { data: callCategoryData, error: categoryError } = useSWR(
    callTypeData && `call_categories?call_type_id=${callTypeId}`,
    fetcher
  );

  // console.log(callCategoryData?.data, "category data");

  const { data: smtpData, error: smtpError } = useSWR("s_m_t_p_s", fetcher);
  const smtp = smtpData ? smtpData.data : [];
  const { data: singleSmtpData, error: SingleSmtpError } = useSWR(
    callSubCategory && `s_m_t_p_s/${callSubCategory?.s_m_t_p_id}`,
    fetcher
  );
  const singleSmtp = singleSmtpData ? singleSmtpData.data : [];
  // console.log(singleSmtp?.[0]?.mail_mailer,"singl smtp ")

  useEffect(() => {
    setCallTypeId(callSubCategory?.call_type_id);
    setCallCategoryId(callSubCategory?.call_category_id);
    setSmtpId(callSubCategory?.s_m_t_p_id);
  }, [callSubCategory]);

  useEffect(() => {
    setValue("name", callSubCategory?.name);
    setValue("name_bn", callSubCategory?.name_bn);
    setValue("call_type_name", callSubCategory?.call_type_name);
    setValue("call_category_name", callSubCategory?.call_category_name);
    setValue("s_m_t_p_id", singleSmtp?.[0]?.mail_mailer);

    // setCallTypeId(callSubCategory?.call_type_id);
    // setCallCategoryId(callSubCategory?.call_category_id);
  }, [callSubCategory, callCategoryData, callTypeData,singleSmtp]);

  const handleCallTypeId = (e) => {
    console.log(e.id, "type id");
    setCallTypeId(parseInt(e.id));
  };
  const handleCallCategoryId = (e) => {
    console.log(e.id, "category id");

    setCallCategoryId(parseInt(e.id));
  };

  const handleSmtpId = (smtpselectedOption) => {
    console.log(smtpselectedOption.id,"from 96 line smtp id")
    setSmtpId(smtpselectedOption.id);
  };

  // console.log(callSubCategory, "call sub category");

  // handle call type and category

  //end handle call type and category

  const onSubmit = (data) => {
    // console.log(data, "form data");
    const newData = {
      ...data,

      id: subCateogoryId,

      call_type_id: callTypeId,
      call_category_id: callCategoryId,
      // s_m_t_p_id: callSubCategory.s_m_t_p_id,
      s_m_t_p_id: smtpId,

      to_list: sentEmailTags,
      cc: ccEmailTags,
      bcc: ccEmailTags,
      department_id: callSubCategory.department_id,
    };
    console.log(newData, "updated data");

    axiosClient(false)
      .put(`/call_sub_categories?=${id}`, newData)
      .then((res) => {
        console.log(res?.data);
        if (res?.data.status === 400) {
          toast.error(`${res?.data.message}`);
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

        return;
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  // sent email
  const [sentEmailTags, setSentEmailTags] = useState();
  const [inputValueSentEmail, setInputValueSentEmail] = useState("");

  // cc email list
  const [ccEmailTags, setCcEmailTags] = useState();
  const [inputValueCcEmail, setInputValueCcEmail] = useState("");

  // Bcc email list
  const [bccEmailTags, setBccEmailTags] = useState();
  const [inputValueBccEmail, setInputValueBccEmail] = useState("");

  useEffect(() => {
    if (callSubCategory) {
      setSentEmailTags(JSON.parse(callSubCategory?.to_list));
      setCcEmailTags(JSON.parse(callSubCategory?.cc));
      setBccEmailTags(JSON.parse(callSubCategory?.bcc));
      setCallTypeId(callSubCategory?.call_type_id);
      setCallCategoryId(callSubCategory?.call_category_id);
    }
  }, [callSubCategory]);

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
  // const [ccEmailTags, setCcEmailTags] = useState([]);
  // const [inputValueCcEmail, setInputValueCcEmail] = useState("");

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
  // const [bccEmailTags, setBccEmailTags] = useState([]);
  // const [inputValueBccEmail, setInputValueBccEmail] = useState("");

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

  // console.log(id);
  return (
    <EditLayout headingName="Call Sub Category Edit">
      <Helmet>
        <title>Update call Sub Category</title>
      </Helmet>
      <div className=" h-full max-w-[593px]  ">
        {error && <p>{error.message}</p>}
        <div className="  px-10 pt-5 mt-5 pb-7 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <SelectComponent
                placeholder="Call Type"
                register={register}
                name="call_type_name"
                selectArr={callTypeData?.data}
                handleCallTypeId={handleCallTypeId}
                error={errors.call_type_name}
                // required={true}
              />
            </div>
            <div>
              <SelectComponent
                placeholder="Call Category"
                name="call_category_name"
                register={register}
                selectArr={callCategoryData?.data}
                error={errors.callCategory}
                handleCallCategoryId={handleCallCategoryId}
                // required={true}
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
                // required={true}
              />
            </div>
            <div>
              <InputField
                label="Call Sub Category Name"
                placeholder="Enter Sub Call Category Name"
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
                placeholder="Enter Call Sub Category Name (bengali)"
                type="text"
                name="name_bn"
                bgcolor="#C1E3D6"
                register={register("name_bn", nameValidation.name_bn)}
                error={errors.name_bn}
                required={true}
              />
            </div>
            {/* email to send */}
            <label>
              <span className="label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold">
                {" "}
                Email to send
              </span>
              <div className="flex flex-wrap gap-2">
                {sentEmailTags?.map((tag, index) => (
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
                  name="to_list"
                  {...register("to_list", nameValidation.email_tags)}
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
                {ccEmailTags?.map((tag, index) => (
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
                {bccEmailTags?.map((tag, index) => (
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
              name="Save Your Edit"
            />
          </form>
        </div>
      </div>
    </EditLayout>
  );
};

export default CallSubCategoryEdit;
