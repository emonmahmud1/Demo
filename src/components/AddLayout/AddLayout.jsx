
import Heading from "../Heading/Heading";

const AddLayout = ({ children, headingName }) => {
  return (
    <div className="pt-5 rounded-lg min-h-[calc(100vh-160px)] dark:bg-[#091818] ">
      
      <div className="flex flex-col  font-poppins max-w-[593px] mx-auto">
        <div className="flex justify-between">
          {headingName && <Heading headingName={headingName} />}
          {/* {headingName && <BackButton />} */}
        </div>
        <div className=" dark:bg-bg-dark bg-[#F6FBF9] border px-10 pt-5 mt-5 pb-7 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AddLayout;
