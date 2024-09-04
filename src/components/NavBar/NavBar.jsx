import { RiArrowDropDownLine, RiLogoutBoxLine } from "react-icons/ri";
import umlLogo from "../../assets/images/umlLogo.png";
import umlLogoDark from "../../assets/images/umlLogoDark.png";
import { useContext, useState } from "react";
import axiosClient from "../../config/axiosConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { buttonArr } from "../buttonArray/buttonArray";
import { UserContext } from "../../pages/routes/PrivateRoute/PrivateRoute";
import ThemeChangeBtn from "../ThemeChangeBtn/ThemeChangeBtn";

const NavBar = () => {
  const user = useContext(UserContext);
  const location = useLocation();
    // console.log(user);

  const pathname = location.pathname.split("/").slice(1);
  // console.log(pathname)
  // const pathNameUrl = location.pathname.split("/").splice(1, 3).join("/");
  // console.log(pathNameUrl);

  const getCurrentTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDropdownOpenMenu, setIsDropdownOpenMenu] = useState(false);

  const toggleDropdownMenu = () => {
    setIsDropdownOpenMenu(!isDropdownOpenMenu);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    axiosClient(false)
      .post("/logout", {})
      .then((res) => {
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="navbar md:px-12  bg-white dark:bg-[#0F3333] justify-between shadow-sm">
      {/*  */}
      <div className="dropdown block lg:hidden">
        <div
          onClick={toggleDropdownMenu}
          tabIndex={0}
          role="button"
          className="btn btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>

        {isDropdownOpenMenu && (
          <div
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {user?.roles_list?.[0]?.id === 1 && (
              <Button buttonArr={buttonArr} />
            )}
            <button
              className="border hover:bg-slate-200 dark:text-white  text-xl rounded-md flex justify-center  items-center mt-4 gap-3"
              onClick={handleLogout}
            >
              <RiLogoutBoxLine />
              Logout
            </button>
          </div>
        )}
      </div>

      {/*  */}
      <div className=" gap-4 relative">
        {/* ulm logo */}
        <div className=" w-[150px] h-[46px] md:w-[200px] md:h-[55px]">
          <Link to="/">
            <img
              className="w-full h-full"
              src={isDarkTheme ? umlLogoDark : umlLogo}
              alt=""
            />
          </Link>
        </div>
        <div className="hidden md:flex md:relative top-2 dark:text-[#CDE7E7] breadcrumbs   text-secondary-light  font-normal text-xs md:text-base">
          {/* {user?.roles[0].name == "Agent"
            ? "Agent Panel"
            : user?.roles[0].name == "Super Admin"
            ? "Super Admin"
            : "System Panel"} */}
          {/* {pathname} */}
          {pathname.map((segment, index) => (
            <span
              key={index}
              className={
                index === pathname.length - 1
                  ? "font-semibold breadcrumbs"
                  : "text-gray-400 breadcrumbs"
              }
            >
              {segment}
              {index < pathname.length - 1 && " > "}
            </span>
          ))}
        </div>
      </div>

      <div className="gap-2  hidden lg:flex">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="flex gap-2 hover:cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="avatar gap-5 items-center">
              <div>
                <ThemeChangeBtn />
              </div>
              <div className="w-10 rounded-r-lg roundend-l-lg">
                <img
                  alt="Tailwind CSS Navbar component"
                  className="rounded-r-lg rounded-l-lg"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <div>
              {/* <h2 className="font-medium text-base text-[#151D48] font-poppins flex">
                {user?.data?.name}{" "}
                <RiArrowDropDownLine className="text-[25px]" />
              </h2> */}
            </div>
          </div>
          {isDropdownOpen && (
            <ul className="mt-3 z-[100] p-2 space-y-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="font-bold">{user?.name}</li>
              <li>{user?.roles_list?.[0]?.name}</li>

              {user?.roles_list?.[0]?.id === 1 && (
                <li className="border border-bg-dark rounded-lg ">
                  <Link to="/dashboard/admin/upade-and-reset-password">
                    Change Password
                  </Link>
                </li>
              )}
              {user?.roles_list?.[0]?.id === 2 && (
                <li className="border border-bg-dark rounded-lg ">
                  <Link to="/dashboard/agent/upade-and-reset-password">
                    Change Password
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>
                  <RiLogoutBoxLine />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
