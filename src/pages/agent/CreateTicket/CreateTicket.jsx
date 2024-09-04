import { useForm } from "react-hook-form";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import { TbNavigationFilled } from "react-icons/tb";
import { useEffect, useState } from "react";
import axiosClient from "../../../config/axiosConfig";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";

const CreateTicket = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data, "from ticketcreate and info");
  };

  const [callType, setCallType] = useState([]);
  const [callCategory, setCallCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  // get call types
  useEffect(() => {
    axiosClient(false)
      .get("/call_types")
      .then((res) => {
        // console.log(res.data)
        setCallType(res.data.data);
      })
      .catch(() => {});
  }, []);

  // get call category using call type id
  const handleCallTypeId = (callTypeId) => {
    console.log(callTypeId, "from ticketcreate");
    axiosClient(false)
      .get(`/call_categories?call_type_id=${callTypeId.id}`)
      .then((res) => {
        setCallCategory(res.data.data);
        console.log(res.data.data);
      })
      .catch(() => {
        setCallCategory([]);
      });
  };

  // get call sub category using call category id
  const handleCallCategoryId = (callCategoryId) => {
    console.log(callCategoryId);
    axiosClient(false)
      .get(
        // call_sub_categories?call_type_id=1&call_category_id=1
        `call_sub_categories?call_type_id=${callCategoryId.id}&call_category_id=${callCategoryId.call_type_id}`
      )
      .then((res) => {
        setSubCategory(res.data.data);
      })
      .catch(() => {
        setSubCategory([]);
      });
  };

  return (
    <form className="grid gap-5 grid-cols-12" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-span-6">
        <SelectComponent
          placeholder="Call Type"
          register={register}
          name="callType"
          selectArr={callType}
          handleCallTypeId={handleCallTypeId}
          error={errors.name}
        />
      </div>
      <div className="col-span-6">
        <SelectComponent
          placeholder="Call Category"
          register={register}
          name="callCategory"
          selectArr={callCategory}
          handleCallCategoryId={handleCallCategoryId}
          error={errors.name}
        />
      </div>
      <div className="col-span-6">
        <SelectComponent
          placeholder="Call Sub-Category"
          register={register}
          name="callSubCategory"
          selectArr={subCategory}
          error={errors.name}
        />
      </div>
      <div className="col-span-12">
        <label className="text-sm md:text-base">
          Remark<sup className="text-red-600 text-base">*</sup>
        </label>
        <textarea
          className="textarea w-full resize-none dark:bg-[#1B5757] border-2  border-[#166835]"
          placeholder=""
          {...register("remarkText")}
        ></textarea>
      </div>
      <div className="col-span-12">
        <SubmitBtn name="Submit Form" />
      </div>
    </form>
  );
};

export default CreateTicket;
