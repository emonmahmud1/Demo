import React, { useEffect } from "react";
import EditLayout from "../../../components/EditLayout/EditLayout";
import InputField from "../../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { nameValidation } from "../../../utilities/validation";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";
import axiosClient, { fetcher } from "../../../config/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useSWR from "swr";

const EditSmtp = () => {
  const { id } = useParams();
  const navigate =useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,

    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();

  const { data } = useSWR(`s_m_t_p_s/${id}`,fetcher);
  const smtpData = data?.data?.[0];
  console.log(smtpData);
  useEffect(() => {
    setValue("mail_mailer", smtpData?.mail_mailer);
    setValue("mail_host", smtpData?.mail_host);
    setValue("mail_port", smtpData?.mail_port);
    setValue("mail_username", smtpData?.mail_username);
    setValue("mail_password", smtpData?.mail_password);
    setValue("mail_encryption", smtpData?.mail_encryption);
    setValue("mail_from_address", smtpData?.mail_from_address);
    setValue("mail_from_name", smtpData?.mail_from_name);
  }, [data]);

  const onSubmit = (data) => {
    // console.log(data);
    
    axiosClient(false)
      .put("/s_m_t_p_s", { ...data, id })
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
            // reset();
            navigate(-1);
          }
        });
      });
  };

  return (
    <EditLayout headingName="Edit SMTP">
       <Helmet>
        <title>Update SMTP</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            label="Mailer Name"
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
            type="email"
            name="mail_from_address"
            bgcolor="#C1E3D6"
            register={register("mail_from_address", nameValidation.email)}
            error={errors.mail_from_address}
          />
        </div>
        <div>
          <InputField
            label="Mail From Name"
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
          name="Update SMTP"
        />
      </form>
    </EditLayout>
  );
};

export default EditSmtp;
