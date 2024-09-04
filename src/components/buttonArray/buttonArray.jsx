import { BsMailbox } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

export const buttonArr = [
  {
    icon: <LuLayoutDashboard />,
    btnName: "Dashboard",
    link: "/dashboard/admin",
    type: "button",
  },

  {
    icon: <IoCallOutline />,
    btnName: "Calls",
    link: "/dashboard/admin",
    type: "dropdown",
    children: [
      { childName: "Call Type", link: "/dashboard/admin/call-type" },
      { childName: "Call Category", link: "/dashboard/admin/call-category" },
      {
        childName: "Call Sub Category",
        link: "/dashboard/admin/call-sub-category",
      },
    ],
  },
  {
    icon: <FaRegUser />,
    btnName: "User",
    link: "/dashboard/admin/users",
    type: "button",
  },
  {
    icon: <BsMailbox />,
    btnName: "SMTP",
    link: "/dashboard/admin/smtps",
    type: "button",
  },
  {
    icon: <MdOutlineProductionQuantityLimits />,
    btnName: "Products",
    link: "/dashboard/admin",
    type: "dropdown",
    children: [
      { childName: "Products", link: "/dashboard/admin/products" },
      { childName: "Product Model", link: "/dashboard/admin/product-model" },
      {
        childName: "Product Variant",
        link: "/dashboard/admin/product-model-variant",
      },
    ],
  },
  // {
  //   icon: <IoSettingsOutline />,
  //   btnName: "Settings",
  //   link: "/home/datatable",
  //   type: "dropdown",
  //   children: [
  //     { childName: "item 1", link: "/home/datatable" },
  //     { childName: "item 1", link: "/home/datatable" },
  //     { childName: "item 1", link: "/home/datatable" },
  //   ],
  // }
];
