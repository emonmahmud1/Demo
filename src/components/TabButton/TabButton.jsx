const TabButton = ({
  tabName,
  onClick,
  tabValue,
  icon,
  isActiveTab,
  cngIcon,
  show,
}) => {
  // console.log(tabValue, "from tab button component.............");
  // console.log(show, "shhow value from tab button component.............");
  // console.log(cngIcon);
  const handleButton = () => {
    onClick(tabValue);
  };
  return (
    <button
      className={`border lg:text-lg text-base flex gap-1 items-center border-[#1F8685] py-1 px-1 lg:px-3 rounded-lg  font-medium ${
        isActiveTab === tabValue
          ? "bg-[#1F8685] dark:bg-[#2F7C7C] text-white"
          : "hover:bg-[#123636] dark:bg-[#091818] dark:text-[#CDE7E7]  bg-[#E5F6F6] hover:text-white text-[#4F4F4F]"
      }`}
      onClick={handleButton}
    >
      {cngIcon && (isActiveTab === tabValue && show ? icon : cngIcon)}
      {cngIcon && (isActiveTab === tabValue  && show ? tabName : "Check")}
      {cngIcon == undefined && icon}
      {cngIcon == undefined && tabName}
    </button>
  );
};

export default TabButton;
