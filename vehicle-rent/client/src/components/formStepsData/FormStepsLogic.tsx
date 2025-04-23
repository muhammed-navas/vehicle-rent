import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { FormState, Vehicle } from "../../types/Type";
import NameForm from "./NameForm";
import WheelCountForm from "./WheelCountForm";
import VehicleTypeForm from "./VehicleTypeForm";
import DateRangeForm from "./DateRangeForm";
import VehicleModelForm from "./VehicleModelForm";
import { createBooking, getVehicleById } from "../../services/api";

interface FormStepsLogicProps {
  step: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export const FormStepsLogic = ({
  step,
  setActiveStep,
  setError,
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
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleLoading, setVehicleLoading] = useState(false);


  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (formState.vehicleId) {
        setVehicleLoading(true);
        try {
          const vehicle = await getVehicleById(formState.vehicleId);
          setSelectedVehicle(vehicle);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        } finally {
          setVehicleLoading(false);
        }
      } else {
        setSelectedVehicle(null);
      }
    };

    fetchVehicleDetails();
  }, [formState.vehicleId]);

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
  const handleSubmit = async () => {
    if (
      !formState.firstName ||
      !formState.lastName ||
      !formState.vehicleId ||
      !formState.startDate ||
      !formState.endDate
    ) {
      setError("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createBooking({
        firstName: formState.firstName,
        lastName: formState.lastName,
        vehicleId: formState.vehicleId as number,
        startDate: formState.startDate as Date,
        endDate: formState.endDate as Date,
      });

      setBookingSuccess(true);
      handleNext();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "An error occurred while creating your booking. Please try again."
        );
      }
      console.error("Booking error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReset = () => {
    setActiveStep(0);
    setFormState(initialFormState);
    setBookingSuccess(false);
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
    case 3:
      return (
        <VehicleModelForm
          formState={formState}
          updateFormState={updateFormState}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    case 4:
      return (
        <DateRangeForm
          formState={formState}
          updateFormState={updateFormState}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    case 5:
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Confirmation</h2>

          <div className="bg-gray-50 p-4 border rounded-md shadow-sm mb-6">
            <h3 className="font-medium text-lg mb-3">Booking Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formState.firstName} {formState.lastName}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Wheels:</span>
                <span className="font-medium">{formState.wheelCount}</span>
              </div>

              {vehicleLoading ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : selectedVehicle ? (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="font-medium">{selectedVehicle.vehicleType?.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Vehicle Model:</span>
                    <span className="font-medium">{selectedVehicle.name}</span>
                  </div>
                  {selectedVehicle.description && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{selectedVehicle.description}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-yellow-600 py-2">Vehicle information not available</div>
              )}

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Dates:</span>
                <span className="font-medium">
                  {formState.startDate?.toLocaleDateString()} -{" "}
                  {formState.endDate?.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Successful!
          </h2>

          <p className="text-gray-600 mb-6">
            Your vehicle rental has been successfully booked. You will receive a
            confirmation email shortly with all the details.
          </p>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book Another Vehicle
          </button>
        </div>
      );
    default:
      return "Unknown step";
  }
};
