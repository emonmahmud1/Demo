import BackButton from "../BackButton/BackButton";

const Heading = ({ headingName, tabHeading }) => {
  return (
    <div className=" h-full flex justify-start mb-1 gap-1">
      {/* {tabHeading && <div className="border-r-8 rounded-[4px] border-[#FF0099]"></div>}{" "} */}
      {tabHeading || (
        <div className="">
          <BackButton />
        </div>
      )}
      <div>
        <h3 className="font-poppins text-center font-medium md:text-xl text-lg text-primary-light py-1 mr-2  ">
          {headingName}
        </h3>
      </div>
    </div>
  );
};

export default Heading;
