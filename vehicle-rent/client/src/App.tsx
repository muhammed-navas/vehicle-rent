import { useState } from "react";
import ErrorToast from "./components/comm/ErrorToas";
import FormStepper from "./components/comm/FormStep";
import {FormStepsLogic} from "./components/formStepsData/FormStepsLogic";

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    "Personal Information",
    "Wheel Count",
    "Vehicle Type",
    "Vehicle Model",
    "Booking Dates",
    "Confirmation",
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Vehicle Rental Booking
            </h1>
            <div className="mb-8">
              <FormStepper steps={steps} currentStep={activeStep} />
            </div>
            <div className="mt-6">
              <FormStepsLogic
                step={activeStep}
                setActiveStep={setActiveStep}
                setError={setError}
              />
            </div>
          </div>
        </div>
      </div>

      <ErrorToast
        show={!!error}
        message={error || ""}
        onClose={() => setError(null)}
      />
    </div>
  );
};

export default App;
