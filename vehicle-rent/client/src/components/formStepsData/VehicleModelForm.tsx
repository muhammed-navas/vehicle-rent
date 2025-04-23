import React, { useState, useEffect } from "react";
import { getVehicles } from "../../services/api";
import Button from "../comm/Button";
import { FormState, Vehicle } from "../../types/Type";

interface VehicleModelFormProps {
  formState: FormState;
  updateFormState: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VehicleModelForm: React.FC<VehicleModelFormProps> = ({
  formState,
  updateFormState,
  onNext,
  onBack,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (formState.vehicleTypeId) {
      fetchVehicles(formState.vehicleTypeId);
    }
  }, [formState.vehicleTypeId]);

  const fetchVehicles = async (vehicleTypeId: number) => {
    setLoading(true);
    setFetchError("");
    setVehicles([]);

    try {
      const data = await getVehicles(vehicleTypeId);
      console.log("Fetched vehicles:", data);
      
      // Check if data is valid and non-empty
      if (Array.isArray(data)) {
        setVehicles(data);
        
        // If the previously selected vehicle is not in the new list, reset it
        if (
          formState.vehicleId &&
          !data.some((vehicle) => vehicle.id === formState.vehicleId)
        ) {
          updateFormState({ vehicleId: null });
        }
        
        // Auto-select vehicle if there's only one available
        if (data.length === 1 && !formState.vehicleId) {
          updateFormState({ vehicleId: data[0].id });
        }
      } else {
        console.error("Invalid data format received:", data);
        setFetchError("Received invalid data format from server");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setFetchError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ vehicleId: parseInt(event.target.value, 10) });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.vehicleId === null) {
      setError("Please select a vehicle");
      return;
    }
    onNext();
  };

  if (!formState.vehicleTypeId) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Please select a vehicle type first</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Specific Model</h2>

      {loading ? (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : fetchError ? (
        <div className="my-4">
          <p className="text-red-600">{fetchError}</p>
          <Button
            onClick={() => fetchVehicles(formState.vehicleTypeId as number)}
            variant="outline"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="my-4">
          {vehicles.length === 0 ? (
            <p className="text-gray-700">
              No vehicles available for the selected type
            </p>
          ) : (
            <fieldset
              className={`${error ? "text-red-600" : "text-gray-700"} w-full`}
            >
              <legend className="font-medium mb-2">
                Select a specific vehicle model
              </legend>
              <div className="mt-2 space-y-2">
                {vehicles.map((vehicle) => (
                  <label
                    key={vehicle.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  >
                    <input
                      type="radio"
                      name="vehicleId"
                      value={vehicle.id}
                      checked={formState.vehicleId === vehicle.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{vehicle.name}</span>
                      {vehicle.description && (
                        <span className="text-sm text-gray-500">{vehicle.description}</span>
                      )}
                    </div>
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
        {vehicles.length === 0 ? (
          <Button
            onClick={() => fetchVehicles(formState.vehicleTypeId as number)}
            variant="outline"
            className="ml-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Vehicles"}
          </Button>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          disabled={loading || vehicles.length === 0 || !formState.vehicleId}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default VehicleModelForm;
