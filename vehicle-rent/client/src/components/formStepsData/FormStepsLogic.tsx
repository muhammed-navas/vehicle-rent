import { Dispatch, SetStateAction, useState } from "react";
import { FormState } from "../../types/Type";
import NameForm from "./NameForm";
import WheelCountForm from "./WheelCountForm";
import VehicleTypeForm from "./VehicleTypeForm";

interface FormStepsLogicProps {
  step: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const FormStepsLogic = ({
  step,
  setActiveStep,
}: FormStepsLogicProps) => {
  const initialFormState: FormState = {
    firstName: "",
    lastName: "",
    wheelCount: null,
    vehicleTypeId: null,
    vehicleId: null,
    startDate: null,
    endDate: null,
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);

  const updateFormState = (update: Partial<FormState>) => {
    setFormState((prev) => {
      const newState = { ...prev, ...update };

      // Reset dependent fields when parent field changes
      if ("wheelCount" in update) {
        newState.vehicleTypeId = null;
        newState.vehicleId = null;
      }

      if ("vehicleTypeId" in update) {
        newState.vehicleId = null;
      }

      return newState;
    });
  };
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  switch (step) {
    case 0:
      return (
        <NameForm
          formState={formState}
          updateFormState={updateFormState}
          onNext={handleNext}
        />
      );
    case 1:
      return (
        <WheelCountForm
          formState={formState}
          updateFormState={updateFormState}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    case 2:
      return (
        <VehicleTypeForm
          formState={formState}
          updateFormState={updateFormState}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    default:
      return "Unknown step";
  }
};
