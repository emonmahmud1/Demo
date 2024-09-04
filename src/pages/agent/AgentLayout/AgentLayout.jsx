import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import NavBar from "../../../components/NavBar/NavBar";

const AgentLayout = () => {
  return (
    <>
      <div className="flex relative flex-col min-h-screen h-screen max-w-[1920px] dark:bg-[#091818] bg-[#E9F3F0] mx-auto">
        <div className="mb-3">
          <NavBar/>
       
        </div>
        <div className="overflow-y-auto   h-[calc(100vh-145px)] md:h-[calc(100vh-135px)]">
          <Outlet/>
        </div>
        <div className="absolute bottom-0 w-full">
          <Footer/>
        </div>
      </div>
    </>
  );
};

export default AgentLayout;