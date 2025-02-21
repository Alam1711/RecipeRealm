import React, { useState } from "react";
import { Input } from "@chakra-ui/react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const [time, setTime] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setTime(newValue);
    onChange(newValue);
  };

  return (
    <Input
      type="text"
      outlineColor={"teal"}
      placeholder="HH:MM"
      value={time}
      onChange={handleChange}
    />
  );
};

export default TimeInput;
