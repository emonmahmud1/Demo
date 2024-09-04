import { useNavigate } from "react-router-dom";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <button
        className="btn btn-xs md:btn-sm md:text-sm text-xs bg-secondary-light border-none text-white md:ml-2"
        onClick={() => navigate(-1)}
      >
        <RiArrowGoBackLine /> Back
      </button> */}
      <div
        className="h-full p-0 text-xs hover:cursor-pointer flex items-center rounded-md border-none  md:ml-2"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="text-xl text-secondary-light h-full" />
      </div>
    </>
  );
};

export default BackButton;
