import { useNavigate } from "react-router-dom";
// import errorImg from "../../../src/assets/images/errorPage.jpg";
import { IoChevronBack } from "react-icons/io5";
import { useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import AnimationDiv from "../AnimationDiv/AnimationDiv";
const ErrorPage = ({
  errorCode,
  errorTitle,
  errorDescrip,
  errorButtonBgColor,
  errorImg,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    setLoading(true);
    navigate("/");
  };
  if (loading) {
    return <LoadingScreen/>
  }
  return (
    <AnimationDiv>
    
    <div className="flex w-full h-screen pt-20 lg:flex-row flex-col-reverse px-4 lg:px-56 justify-center items-center gap-5 max-w-[1920px] mx-auto">
      <div className="">
        <h1 className="text-[#4F4F4F] md:text-4xl text-3xl font-medium mb-2">
          {errorCode}
        </h1>
        <p className="text-[#4F4F4F] md:text-3xl text-2xl mb-2">{errorTitle}</p>
        <p className="text-[#4B4B4B] text-base mb-6">{errorDescrip}</p>
        <button
          className="btn text-white"
          style={{ backgroundColor: errorButtonBgColor }}
          onClick={handleBack}
        >
          <IoChevronBack />
          Back to home
        </button>
      </div>
      <div className=" md:h-full md:w-full w-[500px]">
        <img className=" h-full w-full object-cover" src={errorImg} alt="" />
      </div>
    </div>
    </AnimationDiv>
  );
};

export default ErrorPage;
