import React, { useState } from "react";
import { FormState } from "../../types/Type";
import Button from "../comm/Button";

interface NameFormProps {
  formState: FormState;
  updateFormState: (update: Partial<FormState>) => void;
  onNext: () => void;
}

const NameForm: React.FC<NameFormProps> = ({
  formState,
  updateFormState,
  onNext,
}) => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange =
    (field: "firstName" | "lastName") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFormState({ [field]: e.target.value });
    };

  const validate = (): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
    };

    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formState.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return !newErrors.firstName && !newErrors.lastName;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">What is your name?</h2>

      <div className="space-y-4 mt-4">
        <div className="flex flex-col">
          <label htmlFor="firstName" className="mb-1 font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            value={formState.firstName}
            onChange={handleChange("firstName")}
            required
            autoFocus
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName" className="mb-1 font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            value={formState.lastName}
            onChange={handleChange("lastName")}
            required
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default NameForm;
