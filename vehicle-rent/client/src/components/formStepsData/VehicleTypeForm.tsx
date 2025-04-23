import React, { useState, useEffect } from "react";
import Button from "../comm/Button";
import { FormState, VehicleType } from "../../types/Type";
import { getVehicleTypes } from "../../services/api";

interface VehicleTypeFormProps {
  formState: FormState;
  updateFormState: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VehicleTypeForm = ({
  formState,
  updateFormState,
  onNext,
  onBack,
}: VehicleTypeFormProps) => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (formState.wheelCount) {
      fetchVehicleTypes(formState.wheelCount);
    }
  }, [formState.wheelCount]);

  const fetchVehicleTypes = async (wheelCount: number) => {
    setLoading(true);
    setFetchError("");

    try {
      const data = await getVehicleTypes(wheelCount);
      setVehicleTypes(data);

      // If the previously selected type is not in the new list, reset it
      if (
        formState.vehicleTypeId &&
        !data.some((type: any) => type.id === formState.vehicleTypeId)
      ) {
        updateFormState({ vehicleTypeId: null });
      }
    } catch (err) {
      console.error("Error fetching vehicle types:", err);
      setFetchError("Failed to load vehicle types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ vehicleTypeId: parseInt(event.target.value, 10) });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.vehicleTypeId === null) {
      setError("Please select a vehicle type");
      return;
    }
    onNext();
  };

  if (!formState.wheelCount) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Please select the number of wheels first</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Type of vehicle</h2>

      {loading ? (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : fetchError ? (
        <div className="my-4">
          <p className="text-red-600">{fetchError}</p>
          <Button
            onClick={() => fetchVehicleTypes(formState.wheelCount as number)}
            variant="outline"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="my-4">
          {vehicleTypes.length === 0 ? (
            <p className="text-gray-700">
              No vehicle types available for {formState.wheelCount} wheels
            </p>
          ) : (
            <fieldset
              className={`${error ? "text-red-600" : "text-gray-700"} w-full`}
            >
              <legend className="font-medium mb-2">
                Select the type of vehicle
              </legend>
              <div className="mt-2 space-y-2">
                {vehicleTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="vehicleTypeId"
                      value={type.id}
                      checked={formState.vehicleTypeId === type.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span>{type.name}</span>
                  </label>
                ))}
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </fieldset>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || vehicleTypes.length === 0}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default VehicleTypeForm;
