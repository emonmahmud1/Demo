import { LuPieChart } from "react-icons/lu";


import { buttonArr } from "../buttonArray/buttonArray";
import Button from "../Button/Button";

const SideBar = () => {
  return (
    <>
      <div className="space-y-3 max-w-[250px] font-poppins lg:flex hidden lg:flex-col min-h-[calc(100vh-90px)] dark:bg-[#0F3333] h-full text-white bg-white shadow-sm rounded-r-lg rounded-br-lg md:px-3 lg:px-8 dark:text-gray-800">
        {/* <div className=" mt-2">
          <p className="text-[#737791] mt-3">MAIN</p>
        </div> */}
        <div className="flex ">
          {/* <h2 className="rounded-2xl flex flex-row items-center justify-evenly  lg:py-3 md:px-1 w-full border-none text-[#737791] text-base lg:text-lg font-semibold ">
            <LuPieChart className="text-xl " />
            Dashboard
          </h2> */}
        </div>
        <Button buttonArr={buttonArr} />
      </div>
    </>
  );
};

export default SideBar;
