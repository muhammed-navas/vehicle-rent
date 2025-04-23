
// App.ts 
export interface FormState {
  firstName: string;
  lastName: string;
  wheelCount: number | null;
  vehicleTypeId: number | null;
  vehicleId: number | null;
  startDate: Date | null;
  endDate: Date | null;
}
// App.ts 

// ErrorToast.ts file 
export interface ErrorToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}
// ErrorToast.ts file 

// formStep.ts file 
export interface FormStepperProps {
  steps: string[];
  currentStep: number;
}
// formStep.ts file 

// forms types  file 
export interface FormState {
  firstName: string;
  lastName: string;
  wheelCount: number | null;
  vehicleTypeId: number | null;
  vehicleId: number | null;
  startDate: Date | null;
  endDate: Date | null;
}
// forms types  file 

//vehicleTypeForm.tsx 
export interface VehicleType {
  id: number;
  name: string;
  wheelCount: number;
}
//vehicleTypeForm.tsx 

// Button.tsx 
export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}
// Button.tsx 

// api file 
export interface Vehicle {
  id: number;
  name: string;
  vehicleTypeId: number;
  vehicleType?: VehicleType;
  description?: string;
}
export interface Booking {
  id?: number;
  firstName: string;
  lastName: string;
  vehicleId: number;
  vehicle?: Vehicle;
  startDate: Date | string;
  endDate: Date | string;
}
// api file 

