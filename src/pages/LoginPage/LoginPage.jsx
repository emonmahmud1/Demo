import umlLogo from "../../assets/images/umlLogo.png";
import umlLogoDark from "../../assets/images/umlLogoDark.png";
import loginPageLogoLight from "../../assets/images/loginPageLogoLight.jpeg";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField/InputField";

import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axiosClient, { fetcher } from "../../config/axiosConfig";

import { nameValidation } from "../../utilities/validation";
import DashBoardSkeleton from "../../components/Skeleton/DashBoardSkeleton";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useEffect, useState } from "react";
//import ErrorPage from "../../components/ErrorPage/ErrorPage";

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();
  // console.log(
  //   location.pathname,
  //   "from loging page location......................."
  // );

  const onSubmit = (formdata) => {
    axiosClient(true)
      .post("/login", formdata)
      .then((res) => {
        console.log(res);
        if (res?.data?.status === 400) {
          console.log(res,'err 400')
          setError("serverSide", {
            type: "manual",
            message: `${res?.data?.message}`,
          });
          return;
        } else if (res?.status == 200) {
          localStorage.setItem("token", res.data.data.token);
          toast.success(`${res?.data?.message}`);
          // console.log(res?.data, "user data logiin...............");
          const authenticatedUser = res?.data?.data?.user?.roles_list?.[0]?.id;
          // console.log(authenticatedUser);

          // console.log("user role", authenticatedUser);

          if (authenticatedUser === 2) {
            navigate("/dashboard/agent");
          }
          if (authenticatedUser === 1) {
            navigate("/dashboard/admin");
          }

          reset();
        }
      })
      .catch((err) => {
        console.log(err);
        setError("password", {
          type: "manual",
          message: "Incorrect username or password",
        });
      });
  };
  // const { data, error, isLoading } = useSWR("roles-perms/user", fetcher);
  // const { data, error, isLoading } = getDataFromApi("/roles-perms/user");
  const { data, error, isLoading } = useSWR("me", fetcher);
  // console.log(data);

  const userRole = data?.data?.roles_list?.[0]?.id;

  if (isLoading) {
    return <DashBoardSkeleton />;
  } else if (token) {
    console.log(data?.data?.[0]?.roles?.[0]);
    if (userRole === 2) {
      // console.log("agent need to navigate ");
      return <Navigate to="/dashboard/agent" />;
    } else if (userRole === 1) {
      // console.log("super admin need to navigate");
      return <Navigate to="/dashboard/admin" />;
    }
  }

  return (
    <div className="dark:bg-[#0F3333] dark:text-white font-poppins h-lvh   flex flex-row  md:items-center  justify-center mx-auto max-h-lvh rounded-xl md:gap-5 max-w-screen">
      {/* left side */}
      <div className="  px-3 w-full md:w-1/2 lg:w-5/12 h-lvh">

        <div className=" min-h-[calc(100vh-90px)] flex flex-col justify-center  w-full">
          <div className=" max-w-[800px] mx-auto w-full">
            <div className="">
              <div className="h-20 w-52">
                <img
                  src={isDarkMode ? umlLogoDark : umlLogo}
                  alt="uttara motors logo"
                />
              </div>
              <p className="font-normal text-base dark:text-white text-primary-light mt-7 mb-7">
                Welcome Back, Please <span className="font-bold">login</span> to
                your account
              </p>
            </div>

            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <InputField
                  label="Employee Id"
                  placeholder="employee id"
                  type="number"
                  name="employee_id"
                  register={register("employee_id", nameValidation.id)}
                  error={errors.employee_id}
                  required={true}
                />
              </div>

              <div>
                <InputField
                  label="Password"
                  placeholder="******"
                  type="password"
                  name="password"
                  register={register("password", nameValidation.password)}
                  error={errors.password}
                  required={true}
                />
              </div>

              <span className="font-light text-red-700 italic text-sm text-center">
                {errors?.serverSide?.message}
              </span>

              <div className="flex justify-center mt-3 gap-2">
                <input type="checkbox" name="" id="" />
                <span className="dark:text-white font-inter label-text text-sm md:text-base text-[#4B4B4B] font-semibold">
                  Remember me
                </span>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  onClick={() => {
                    clearErrors();
                  }}
                  className="hover:bg-[#cf75ab] bg-primary-light text-white font-semibold p-2 rounded-md w-full"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>

          <div className="md:mt-auto mt-6  dark:text-white text-[#1F8685]  text-center  w-full">
            <p className=" font-inter text-sm lg:text-base">
              Developed by{" "}
              <span className="font-semibold">Digicon Technologies Ltd</span>
            </p>
            <p className=" font-inter text-xs lg:text-sm mt-4">
              Copyright © 2024 Digicon Technologies Ltd. All right reserved
            </p>
          </div>
      </div>

      {/* right side */}

      <div className="items-center  lg:w-3/5 h-full md:w-full flex-grow max-w-full hidden md:flex w-full bg-[#01304A]">
        <img
          className="w-full h-full object-cover"
          src={loginPageLogoLight}
          alt="login page logo"
        />
      </div>
    </div>
  );
};

export default LoginPage;
