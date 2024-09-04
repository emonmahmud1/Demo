import React from "react";
import AddLayout from "../../../components/AddLayout/AddLayout";
import InputField from "../../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { nameValidation } from "../../../utilities/validation";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import axiosClient from "../../../config/axiosConfig";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const AddSmtp = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,

    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    axiosClient(false)
      .post("/s_m_t_p_s", data)
      .then((res) => {
        console.log(res?.data);
        if (res?.data.status === 400 || res?.data.status === 405) {
          if (res?.data.data.mail_mailer) {
            setError("mail_mailer", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_host) {
            setError("mail_host", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_port) {
            setError("mail_port", {
              type: "custom",
              message: `${res.data.data.mail_port}`,
            });
          }
          if (res?.data.data.mail_username) {
            setError("mail_username", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_password) {
            setError("mail_password", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_encryption) {
            setError("mail_encryption", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_from_address) {
            setError("mail_from_address", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          if (res?.data.data.mail_from_name) {
            setError("mail_from_name", {
              type: "custom",
              message: `${res.data.message}`,
            });
          }
          return;
        }

        Swal.fire({
          title: "Success",
          text: `${res.data.message}`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            reset();
            // navigate(-1);
          }
        });
      });
  };

  return (
    <AddLayout headingName="Add SMTP">
       <Helmet>
        <title>Add SMTP</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            label="Mailer Name"
            placeholder="Mailer"
            type="text"
            name="mail_mailer"
            bgcolor="#C1E3D6"
            register={register("mail_mailer", nameValidation.string)}
            error={errors.mail_mailer}
          />
        </div>
        <div>
          <InputField
            label="Host Name"
            placeholder="host Name"
            type="text"
            name="mail_host"
            bgcolor="#C1E3D6"
            register={register("mail_host", nameValidation.string)}
            error={errors.mail_host}
          />
        </div>
        <div>
          <InputField
            label="Port"
            placeholder="Port"
            type="text"
            name="mail_port"
            bgcolor="#C1E3D6"
            register={register("mail_port", nameValidation.string)}
            error={errors.mail_port}
          />
        </div>
        <div>
          <InputField
            label="Mail User Name"
            placeholder="username"
            type="text"
            name="mail_username"
            bgcolor="#C1E3D6"
            register={register("mail_username", nameValidation.string)}
            error={errors.mail_username}
          />
        </div>
        <div>
          <InputField
            label="Mail Password"
            placeholder="password"
            type="password"
            name="mail_password"
            bgcolor="#C1E3D6"
            register={register("mail_password", nameValidation.string)}
            error={errors.mail_password}
          />
        </div>
        <div>
          <InputField
            label="Encryption Type"
            placeholder="encryption type"
            type="text"
            name="mail_encryption"
            bgcolor="#C1E3D6"
            register={register("mail_encryption", nameValidation.string)}
            error={errors.mail_encryption}
          />
        </div>
        <div>
          <InputField
            label="Mail From Address"
            placeholder="mail from address"
            type="text"
            name="mail_from_address"
            bgcolor="#C1E3D6"
            register={register("mail_from_address", nameValidation.email)}
            error={errors.mail_from_address}
          />
        </div>
        <div>
          <InputField
            label="Mail From Name"
            placeholder="mail from name"
            type="text"
            name="mail_from_name"
            bgcolor="#C1E3D6"
            register={register("mail_from_name", nameValidation.string)}
            error={errors.mail_from_name}
          />
        </div>
        <SubmitBtn
          isSubmitSuccessful={isSubmitSuccessful}
          isValid={isValid}
          name="Add New SMTP"
        />
      </form>
    </AddLayout>
  );
};

export default AddSmtp;
