
import { Fragment } from "react/jsx-runtime";
import { FormStepperProps } from "../../types/Type";

const FormStepper = ({
  steps,
  currentStep,
}: FormStepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <Fragment key={step}>
              <div className="flex flex-col items-center">
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive || isCompleted ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepper;
