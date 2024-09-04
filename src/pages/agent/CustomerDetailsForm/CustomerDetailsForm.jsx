import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axiosClient from "../../../config/axiosConfig";
import SubmitBtn from "../../../components/SubmitBtn/SubmitBtn";

const CustomerDetailsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [servicingDate, setServicingDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const onSubmit = (data) => {
    console.log(
      { ...data, servicingDate, purchaseDate },
      "from customer details"
    );
    reset();
  };
 // const vehicleArr = ["car1", "car2", "car3", "car4"];

 const [products,setProducts] = useState([]);
 const [productModel, setProductModel]= useState([]);
 const [productVarient, setProductVarient]= useState([]);
  useEffect(() => {
    axiosClient(false)
      .get("/products")
      .then((res) => {
        // console.log(res.data.data)
        setProducts(res.data.data);
      })
      .catch(() => {});
  }, []);


  // get model using product id
  const handleProductId = (productId) => {
    console.log(productId, "from customer details");
    axiosClient(false)
      .get(`/product_models?product_id=${productId.id}`)
      .then((res) => {
        setProductModel(res.data.data);
        console.log(res.data.data)
      })
      .catch(() => {
        setProductModel([]);
      });
  };
  // get varient using product and model id
  const handleProductModelId = (productModelId) => {
    console.log(productModelId)
    axiosClient(false)
      .get(
        // call_sub_categories?call_type_id=1&call_category_id=1
        `call_sub_categories?call_type_id=${productModelId.id}&call_category_id=${productModelId.product_id}`
      )
      .then((res) => {
        setProductVarient(res.data.data);
      })
      .catch(() => {
        setProductVarient([]);
      });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-2">
        <div className="bg-[#c8ecec] dark:bg-[#0F3333] font-poppins rounded-lg p-2">
          <h1 className="text-center mb-4 text-[#1F8685] font-medium text-base">
            Personal Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Name"
                placeholder=""
                name="name"
                register={register}
                error={errors.name}
                bgcolor="#fff"
                textColor="black"
                required={true}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Phone"
                placeholder=""
                name="phone"
                register={register}
                error={errors.phone}
                bgcolor="#fff"
                textColor="black"
                required={true}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Alternate Number"
                placeholder=""
                name="altPhone"
                register={register}
                error={errors.altPhone}
                bgcolor="#fff"
                textColor="black"
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <InputField
                label="Registered Phone Number"
                placeholder=""
                name="registeredPhone"
                register={register}
                error={errors.registeredPhone}
                bgcolor="#fff"
                textColor="black"
                required={true}
              />
            </div>
            <div className="col-span-12 md:col-span-7">
              <InputField
                label="Address"
                placeholder=""
                name="address"
                register={register}
                error={errors.address}
                bgcolor="#fff"
                textColor="#979797"
                required={true}
              />
            </div>
          </div>
        </div>
        {/* product details */}
        <div className="bg-[#aae0e0] dark:bg-[#1B5757] font-poppins rounded-lg mt-3 p-2">
          <h1 className="text-center mb-4 text-[#1F8685] font-medium text-base">
            Product Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <SelectComponent
                placeholder="Vehicle Product id"
                register={register}
                name="product_name"
                selectArr={products}
                handleProductId={handleProductId}
                error={errors.name}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <SelectComponent
                placeholder="Vehicle Product Model id"
                register={register}
                name="model_name"
                selectArr={productModel}
                handleProductModelId={handleProductModelId}
                error={errors.name}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <SelectComponent
                placeholder="Product Model Varient id"
                register={register}
                name="model_varient"
                selectArr={productVarient}
                error={errors.name}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                label=" Vehicle Registration Number"
                placeholder=""
                name="reg_number"
                register={register}
                error={errors.name}
                bgcolor="#fff"
                textColor="black"
                required={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <InputField
                label=" Engine Number"
                placeholder=""
                name="engine_number"
                register={register}
                error={errors.engine_number}
                bgcolor="#fff"
                textColor="black"
                required={true}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Odometer Reading (Kms)"
                placeholder=""
                name="odometer_reading"
                register={register}
                error={errors.odometer_reading}
                bgcolor="#fff"
                textColor="black"
              />
            </div>
            <div className="col-span-12 md:col-span-4 ">
              <label className="">
                Date of Purchase
                <DatePicker
                  className="dark:bg-[#2d7a7a] w-full mt-1 pt-2"
                  showIcon
                  toggleCalendarOnIconClick
                  selected={purchaseDate}
                  onChange={(date) => setPurchaseDate(date)}
                  icon="fa fa-calendar"
                />
              </label>
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Chassis Number"
                placeholder=""
                name="chassis_number"
                register={register}
                error={errors.chassis_number}
                bgcolor="#fff"
                textColor="black"
              />
            </div>

            {/* row 3 */}
            <div className="col-span-12 md:col-span-4 ">
              <label className="">
                Last Servicing Date
                <DatePicker
                  className="w-full dark:bg-[#2d7a7a] mt-1 pt-2"
                  showIcon
                  toggleCalendarOnIconClick
                  selected={servicingDate}
                  onChange={(date) => setServicingDate(date)}
                />
              </label>
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Servicing Count"
                placeholder=""
                name="servicing_count"
                register={register}
                error={errors.servicing_count}
                bgcolor="#fff"
                textColor="black"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <InputField
                label="Warranty Status"
                placeholder=""
                name="warranty_status"
                register={register}
                error={errors.warranty_status}
                bgcolor="#fff"
                textColor="#979797"
                required={true}
              />
            </div>
          </div>
        </div>

        <SubmitBtn name="Submit Form" />
      </form>
    </>
  );
};

export default CustomerDetailsForm;
