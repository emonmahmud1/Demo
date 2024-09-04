import { Outlet } from "react-router-dom";
import NavBar from "../../../components/NavBar/NavBar";
import SideBar from "../../../components/SideBar/SideBar";
import Footer from "../../../components/Footer/Footer";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <div className="flex relative flex-col min-h-screen h-screen max-w-[1920px] dark:bg-[#091818] bg-[#E9F3F0] mx-auto">
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="mb-2">
          <NavBar />
        </div>
        <div className="max-h-[calc(100vh-135px)] gap-5 flex overflow-hidden">
          <div className="lg:w-2/12 lg:block hidden ">
            <SideBar />
          </div>
          <div className="lg:w-10/12 w-full rounded-lg">
            <div className="overflow-y-auto h-full ">
              <Outlet />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
