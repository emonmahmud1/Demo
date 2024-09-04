import { useEffect, useState } from "react";

const DebouncedInput = ({ value: initValue, onChange, ...props }) => {
  const [value, setValue] = useState(initValue);
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      className="dark:bg-[#1F8685]"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default DebouncedInput;
