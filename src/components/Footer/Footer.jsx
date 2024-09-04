const Footer = () => {
  return (
    <div className="bg-primary-light dark:bg-[#0F3333] h-16 md:h-12 flex justify-between items-center p-2  lg:px-14">
      <div>
        <p className="text-sm font-normal text-[#fff]">
          Developed by{" "}
          <span className="font-semibold">Digicon Technologies Ltd</span>
        </p>
      </div>
      <div>
        <p className="text-xs font-normal text-[#fff]">
          Copyright © 2024 Digicon Technologies Ltd. All right reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
