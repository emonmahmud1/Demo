import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Root from "./pages/Root/Root.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import AgentLayout from "./pages/agent/AgentLayout/AgentLayout.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard/AgentDashboard.jsx";
import PrivateRoute from "./pages/routes/PrivateRoute/PrivateRoute.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import TicketDetails from "./pages/agent/TicketDetails/TicketDetails.jsx";
import AdminLayout from "./pages/admin/AdminLayout/AdminLayout.jsx";
import AnimationDiv from "./components/AnimationDiv/AnimationDiv.jsx";
import CallCategory from "./pages/admin/CallCategory/CallCategory.jsx";
import CallcategoryAdd from "./pages/admin/CallCategory/CallcategoryAdd.jsx";
import CallSubCategoryAdd from "./pages/admin/CallSubCategory/CallSubCategoryAdd.jsx";
import CallSubCategory from "./pages/admin/CallSubCategory/CallSubCategory.jsx";
import CallType from "./pages/admin/CallType/CallType.jsx";
import CallTypeAdd from "./pages/admin/CallType/CallTypeAdd.jsx";
import CallTypeEdit from "./pages/admin/CallType/CallTypeEdit.jsx";
import CallCategoryEdit from "./pages/admin/CallCategory/CallCategoryEdit.jsx";
import CallSubCategoryEdit from "./pages/admin/CallSubCategory/CallSubCategoryEdit.jsx";
import "react-toastify/dist/ReactToastify.css";
import ProductsList from "./pages/admin/Products/ProductsList/ProductsList.jsx";
import UserDetails from "./pages/admin/Users/UserDetails/UserDetails.jsx";
import UserList from "./pages/admin/Users/UserList/UserList.jsx";
import UpdateUserDetails from "./pages/admin/Users/UpdateUserDetails/UpdateUserDetails.jsx";
import AddProduct from "./pages/admin/Products/ProductsList/AddProduct.jsx";
import ProductModel from "./pages/admin/Products/ProductModel/ProductModel.jsx";
import ProductModelVariant from "./pages/admin/Products/ProductModelVariant/ProductModelVariant.jsx";
import AddProductModel from "./pages/admin/Products/ProductModel/AddProductModel.jsx";
import EditProduct from "./pages/admin/Products/ProductsList/EditProduct.jsx";
import EditProductModel from "./pages/admin/Products/ProductModel/EditProductModel.jsx";
import AddProductVariant from "./pages/admin/Products/ProductModelVariant/AddProductVariant.jsx";
import EditProductVariant from "./pages/admin/Products/ProductModelVariant/EditProductVariant.jsx";
import ChangeUpdatePasswordLayout from "./pages/ChangeUpdatePassword/ChangeUpdatePasswordLayout/ChangeUpdatePasswordLayout.jsx";
import AddUser from "./pages/admin/Users/AddUser/AddUser.jsx";
import SmtpList from "./pages/admin/Smtp/SmtpList.jsx";
import AddSmtp from "./pages/admin/Smtp/AddSmtp.jsx";
import EditSmtp from "./pages/admin/Smtp/EditSmtp.jsx";
import DashBoardSkeleton from "./components/Skeleton/DashBoardSkeleton.jsx";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/AdminLayout/AdminDashboardComponents/AdminDashboard/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <ErrorPage
        errorCode="404"
        errorTitle="Page  not found "
        errorDescrip="This Page doesn`t exist or was removed!
        We suggest you  back to home."
        // errorImg={error404}
        errorButtonBgColor="#EF4836"
      />
    ),
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      // agent
      {
        path: "/dashboard/agent",
        element: (
          <PrivateRoute usr={2}>
            <AgentLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard/agent",
            element: <AgentDashboard />,
          },
          {
            path: "/dashboard/agent:phone",
            element: <AgentDashboard />,
          },
          {
            path: "/dashboard/agent/view/:id",
            element: <TicketDetails />,
          },
          {
            path: "/dashboard/agent/upade-and-reset-password",
            element: <ChangeUpdatePasswordLayout />,
          },
        ],
      },
      // admin
      {
        path: "/dashboard/admin",
        element: (
          <PrivateRoute usr={1}>
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard/admin",
            element: (
              <AnimationDiv>
                <AdminDashboard />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-sub-category",
            element: (
              <AnimationDiv>
                <CallSubCategory />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-type",
            element: (
              <AnimationDiv>
                {" "}
                <CallType />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-category",
            element: (
              <AnimationDiv>
                <CallCategory />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-type/add-new-call-type",
            element: (
              <AnimationDiv>
                <CallTypeAdd />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-category/add-new-call-category",
            element: (
              <AnimationDiv>
                <CallcategoryAdd />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-sub-category/add-new-call-subcategory",
            element: (
              <AnimationDiv>
                <CallSubCategoryAdd />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-type/edit/:id",
            element: (
              <AnimationDiv>
                <CallTypeEdit />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-category/edit/:id",
            element: (
              <AnimationDiv>
                <CallCategoryEdit />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/call-sub-category/edit/:id",
            element: (
              <AnimationDiv>
                <CallSubCategoryEdit />
              </AnimationDiv>
            ),
          },
          // products
          {
            path: "/dashboard/admin/products",
            element: (
              <AnimationDiv>
                <ProductsList />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/products/add-product",
            element: (
              <AnimationDiv>
                <AddProduct />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/products/edit/:id",
            element: (
              <AnimationDiv>
                <EditProduct />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/product-model",
            element: (
              <AnimationDiv>
                <ProductModel />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/add-product-model",
            element: (
              <AnimationDiv>
                <AddProductModel />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/product-model/edit/:id",
            element: (
              <AnimationDiv>
                <EditProductModel />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/product-model-variant",
            element: (
              <AnimationDiv>
                <ProductModelVariant />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/add-model-variant",
            element: (
              <AnimationDiv>
                <AddProductVariant />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/product-model-variant/edit/:id",
            element: (
              <AnimationDiv>
                <EditProductVariant />
              </AnimationDiv>
            ),
          },
          // users
          {
            path: "/dashboard/admin/users",
            element: (
              <AnimationDiv>
                <UserList />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/users/view/:id",
            element: (
              <AnimationDiv>
                <UserDetails />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/users/edit/:id",
            element: (
              <AnimationDiv>
                <UpdateUserDetails />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/users/add-new-user",
            element: (
              <AnimationDiv>
                <AddUser />
              </AnimationDiv>
            ),
          },
          {
            path: "/dashboard/admin/upade-and-reset-password",
            element: <ChangeUpdatePasswordLayout />,
          },

          // smtp
          {
            path: "/dashboard/admin/smtps",
            element: <SmtpList />,
          },
          {
            path: "/dashboard/admin/smtps/add-smtp",
            element: <AddSmtp />,
          },
          {
            path: "/dashboard/admin/smtps/edit/:id",
            element: <EditSmtp />,
          },
          {
            path: "/dashboard/admin/skeleton",
            element: <DashBoardSkeleton />,
          },
        ],
      },
      // update and change password
      // {
      //   path: "/upade-and-reset-password",
      //   element: <ChangeUpdatePasswordLayout />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <HelmetProvider />
    <RouterProvider router={router} />
    <Toaster position="top-center" reverseOrder={false} />
    {/* <ToastContainer /> */}
  </>
);
