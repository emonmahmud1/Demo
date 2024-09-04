import { useEffect, useRef, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";

const InputField = ({
  type,
  placeholder,
  name,
  register,
  error,
  label,
  bgcolor,
  textColor,
  required,

}) => {
  const [showHide, setShowHide] = useState(true);

  // console.log(register);
 



  const handleShowHide = () => {
    setShowHide(!showHide);
  };

  return (
    <div>
      <div className="relative mb-2">
        <label
          className={
            textColor
              ? `text-[${textColor}] dark:text-[#CDE7E7] text-sm md:text-base`
              : "label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm md:text-base font-semibold"
          }
        >
          {label} {required && <sup className="text-red-600">*</sup>}
        </label>
        <input
          type={type === "password" && showHide ? "password" : "text"}
          placeholder={placeholder}
          {...register}
          // register
          className={
            bgcolor
              ? `bg-[${bgcolor}] dark:bg-[#256C6C]  px-2 py-2 focus:ring focus:border-primary-light focus:outline-none pl-3 rounded-lg w-full`
              : "mt-2 px-2 py-2 focus:ring focus:border-primary-light focus:outline-none pl-3 dark:bg-[#256C6C] dark:border bg-slate-100 rounded-lg w-full"
          }
        />
        {type === "password" &&
          (showHide ? (
            <IoEyeOffOutline
              onClick={handleShowHide}
              className="absolute bottom-[13%] right-3 text-lg cursor-pointer"
            />
          ) : (
            <FaRegEye
              onClick={handleShowHide}
              className="absolute bottom-[13%] right-3 text-lg cursor-pointer"
            />
          ))}
      </div>
      {error && (
        <span className="font-light text-red-700 italic text-xs md:text-sm">
          {error.message || `${label} is required`}
        </span>
      )}
    </div>
  );
};

export default InputField;
