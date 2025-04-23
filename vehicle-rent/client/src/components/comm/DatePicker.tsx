import React, { useState } from "react";
import { format, isValid } from "date-fns";

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  error?: string;
  id?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  error,
  id,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(
    value ? format(value, "yyyy-MM-dd") : ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const date = new Date(val);
    if (isValid(date)) {
      onChange(date);
    } else {
      onChange(null);
    }
  };

  const minDate = min ? format(min, "yyyy-MM-dd") : undefined;
  const maxDate = max ? format(max, "yyyy-MM-dd") : undefined;

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type="date"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={inputValue}
        onChange={handleInputChange}
        min={minDate}
        max={maxDate}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
