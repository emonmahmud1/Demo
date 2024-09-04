import { createContext, useState } from "react";
export const FormContext = createContext();
const CreateTicketContext = () => {
    const [formData, setFormData] = useState({});

    const updateFormData = (newData) => {
      setFormData(prevData => ({ ...prevData, ...newData }));
    };
  
    return (
      <FormContext.Provider value={{ formData, updateFormData }}>
        {children}
      </FormContext.Provider>
    );
};

export default CreateTicketContext;