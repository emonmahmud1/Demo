import { useContext, useState } from "react";

export const MainContext = useContext(null);

const ContextProvider = ({ children }) => {
  const [heading, SetHeading] = useState("");
  const value = {
    heading,
    SetHeading,
  };
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default ContextProvider;
