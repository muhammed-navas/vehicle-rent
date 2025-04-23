import React, { useState } from "react";
import Button from "../comm/Button";
import { FormState } from "../../types/Type";

interface WheelCountFormProps {
  formState: FormState;
  updateFormState: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const WheelCountForm = ({
  formState,
  updateFormState,
  onNext,
  onBack,
}: WheelCountFormProps) => {
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ wheelCount: parseInt(event.target.value, 10) });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.wheelCount === null) {
      setError("Please select number of wheels");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Number of wheels</h2>

      <div className="my-4">
        <fieldset className={error ? "text-red-600" : "text-gray-700"}>
          <legend className="font-medium mb-2">
            Select the number of wheels
          </legend>
          <div className="mt-2 space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="wheelCount"
                value="2"
                checked={formState.wheelCount === 2}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>2 wheels</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="wheelCount"
                value="4"
                checked={formState.wheelCount === 4}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>4 wheels</span>
            </label>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </fieldset>
      </div>

      <div className="mt-6 flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default WheelCountForm;
