import Swal from "sweetalert2";
import axiosClient from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export const postData=(api,data)=>{
    axiosClient(false)
    .post(api, data)
    .then(() => {
      Swal.fire({
        title: "Success",
        text: "Your Row has been successfully created.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          //   navigate("/dashboard/admin/call-category");
          navigate(-1)
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}