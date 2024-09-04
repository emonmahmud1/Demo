import { createContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ErrorPage from "../../../components/ErrorPage/ErrorPage";
// import error401 from "../../assets/images/error401.png";
// import getDataFromApi from "../../../utilities/getDataFromApi";
import DashBoardSkeleton from "../../../components/Skeleton/DashBoardSkeleton";
import useSWR from "swr";
import { fetcher } from "../../../config/axiosConfig";

export const UserContext = createContext(null);

const PrivateRoute = ({ children, usr }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");


  const { data, error, isLoading } = useSWR('me', fetcher);
  // console.log(data?.data);

  const userRole = data?.data?.roles_list?.[0]?.id;
  // console.log(userRole)
  if (isLoading) {
    // console.log(userRole)
    return <DashBoardSkeleton />;
  }
  if (error) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (data) {
    if (userRole !== usr) {
      // console.log(userRole)
      return (
        <div className="h-screen flex items-center justify-center text-3xl">
          <ErrorPage
            errorCode="401"
            errorTitle="No Authorization Found"
            errorDescrip="This page is not publicly authorized."
            errorButtonBgColor="#809DF9"
          />
        </div>
      );
    }
  }

  return (
    <UserContext.Provider value={data?.data}>
      {children}
    </UserContext.Provider>
  );
};

export default PrivateRoute;
