

import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { NavLink } from "react-router-dom";

const SidebarButton = ({ btnName, link, type, items, icon, onClick, isOpen, onToggle }) => {
  if (type === "dropdown") {
    return (
      <div className="hover:cursor-pointer font-poppins">
        <div className="dropdown w-full font-poppins text-[#737791]">
          <div
            className={
              isOpen ? "bg-[#F6F6F6] flex items-center rounded-md p-1" : "p-1 flex items-center"
            }
            onClick={onToggle}
          >
            <div className="flex gap-2 items-center w-full">
              <span className="text-xl md:text-base">{icon}</span>
              <h2 className="text-base md:text-base">{btnName}</h2>
            </div>
            <div>
              {isOpen ? (
                <IoIosArrowDown className="text-base text-black" />
              ) : (
                <IoIosArrowForward className="text-base text-black" />
              )}
            </div>
          </div>
          <div
            className={`pl-10 lg:pl-11 mt-2 flex flex-col w-full overflow-hidden transition-all duration-300 ${
              isOpen ? 'max-h-[1000px]' : 'max-h-0'
            }`}
          >
            {items?.map((item, index) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "mb-1 text-sm font-medium text-[#F6F6F6] bg-primary-light hover:text-[#F6F6F6] pl-2 py-1 pr-1 rounded-md"
                    : "mb-1 text-sm font-medium hover:bg-primary-light hover:text-[#F6F6F6] pl-2 py-1 pr-1 rounded-md"
                }
                key={index}
                to={item.link}
              >
                {item.childName}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h2 className="text-[#737791] flex dark:hover:text-white rounded-md gap-2 items-center text-base font-poppins p-1">
        {btnName === "logout" ? (
          <button
            className=""
            onClick={() => {
              onClick();
              onToggle(); 
            }}
          >
            {btnName}
          </button>
        ) : (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-[#F6F6F6] bg-primary-light hover:bg-primary-light p-1 w-full hover:text-[#F6F6F6] rounded-md flex items-center gap-1"
                : "hover:bg-primary-light w-full p-1 hover:text-[#F6F6F6] rounded-md flex items-center gap-1"
            }
            to={link}
            onClick={onToggle}
          >
            {icon}
            {btnName}
          </NavLink>
        )}
      </h2>
    );
  }
};

const Button = ({ buttonArr }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const savedDropdown = localStorage.getItem("openDropdown");
    if (savedDropdown) {
      setOpenDropdown(parseInt(savedDropdown, 10));
    }
  }, []);

  useEffect(() => {
    if (openDropdown !== null) {
      localStorage.setItem("openDropdown", openDropdown);
    }
  }, [openDropdown]);

  const handleToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleNonDropdownClick = () => {
    setOpenDropdown(null); 
  };

  return (
    <div className="flex flex-col gap-3 font-poppins">
      {buttonArr.map((item, index) => (
        <SidebarButton
          key={index}
          icon={item.icon}
          btnName={item.btnName}
          link={item.link}
          type={item.type}
          items={item.children}
          isOpen={openDropdown === index}
          onToggle={() => handleToggle(index)}
          onClick={item.onClick || handleNonDropdownClick}
        />
      ))}
    </div>
  );
};

export default Button;

