const SelectComponent = ({
  register,
  name,
  selectArr = [],
  error,
  placeholder,
  required,
  handleCallTypeId = false,
  handleCallCategoryId = false,
  handleProductId = false,
  handleProductModelId = false,
  handleDepartmentId = false,
  handleSmtpId = false,
}) => {
  // console.log(required)
  // console.log(required,name,error)
  // console.log(selectArr);

  const handleIdOnChange = (e) => {
    // product id
    if (handleProductId || handleProductModelId) {
      // console.log(e.target.value)
      const selectedId = selectArr.find((item) => item.name == e.target.value);
      if (name == "product_name") {
        if (!selectedId) {
          handleProductId(0);
          return;
        }

        handleProductId(selectedId);
      } else if (name == "model_name") {
        if (!selectedId) {
          handleProductModelId(0);
          return;
        }
        handleProductModelId(selectedId);
      }
    }

    // call id

    if (handleCallTypeId || handleCallCategoryId) {
      const selectedId = selectArr.find((item) => item.name == e.target.value);
      if (name == "callType" || name == "call_type_name") {
        if (!selectedId) {
          handleCallTypeId(0);
          return;
        }

        handleCallTypeId(selectedId);
      } else if (name == "callCategory" || name=="call_category_name") {
        if (!selectedId) {
          handleCallCategoryId(0);
          return;
        }
        handleCallCategoryId(selectedId);
      }
    }
    // handle department id
    if (handleDepartmentId) {
      const selectedId = selectArr.find((item) => item.name == e.target.value);
      if (name == "department_id") {
        if (!selectedId) {
          handleDepartmentId(0);
          return;
        }

        handleDepartmentId(selectedId);
      }
    }
    // handle smtp id
    if (handleSmtpId) {
      const selectedId = selectArr.find((item) => item.mail_mailer == e.target.value);
      if (name == "s_m_t_p_id") {
        if (!selectedId) {
          handleSmtpId(0);
          return;
        }

        handleSmtpId(selectedId);
      }
    }
  };

  return (
    <>
      <label className=" md:text-[13px] label-text dark:text-[#CDE7E7] text-[#1F8685] text-sm font-semibold">
        {placeholder}
        {required && <sup className="text-red-600 text-base">*</sup>}
      </label>
      <select
        className="select dark:bg-[#2d7a7a] bg-[#c8ecec] text-black select-bordered w-full border border-[#166835] mb-3"
        {...register(name, { required })}
        onChange={handleIdOnChange}
      >
        <option value="">Select </option>
        {Array.isArray(selectArr) &&
          selectArr.map((item, idx) => {
            // console.log(item.name)
            return (
              <option
                key={idx}
                value={item.name ? item.name : item.mail_mailer}
              >
                {item.name ? item.name : item.mail_mailer}
              </option>
            );
          })}
      </select>
      {error && (
        <span className="font-light text-red-700 italic text-xs md:text-sm ">
          {name} is required
        </span>
      )}
    </>
  );
};

export default SelectComponent;
