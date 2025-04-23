import React, { useState } from "react";
import { addDays, isAfter } from "date-fns";
import Button from "../comm/Button";
import { FormState } from "../../types/Type";
import DatePicker from "../comm/DatePicker";

interface DateRangeFormProps {
  formState: FormState;
  updateFormState: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateRangeForm: React.FC<DateRangeFormProps> = ({
  formState,
  updateFormState,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });

  const today = new Date();

  const handleStartDateChange = (date: Date | null) => {
    updateFormState({ startDate: date });

    // Clear error when user makes a selection
    if (date) {
      setErrors((prev) => ({ ...prev, startDate: "" }));

      // If end date is before new start date, clear end date
      if (formState.endDate && isAfter(date, formState.endDate)) {
        updateFormState({ endDate: null });
      }
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    updateFormState({ endDate: date });

    // Clear error when user makes a selection
    if (date) {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors = {
      startDate: "",
      endDate: "",
    };

    if (!formState.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formState.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formState.startDate &&
      formState.endDate &&
      !isAfter(formState.endDate, formState.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return !newErrors.startDate && !newErrors.endDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  if (!formState.vehicleId) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Please select a vehicle first</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Booking Dates</h2>

      <p className="mb-4 text-gray-700">
        Select the start and end dates for your booking
      </p>

      <div className="space-y-6 my-4">
        <DatePicker
          id="start-date"
          label="Start Date"
          value={formState.startDate}
          onChange={handleStartDateChange}
          min={today}
          error={errors.startDate}
          required
        />

        <DatePicker
          id="end-date"
          label="End Date"
          value={formState.endDate}
          onChange={handleEndDateChange}
          min={
            formState.startDate
              ? addDays(formState.startDate, 1)
              : addDays(today, 1)
          }
          error={errors.endDate}
          required
        />
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

export default DateRangeForm;
