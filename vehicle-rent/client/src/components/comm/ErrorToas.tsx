import { useEffect } from "react";
import { ErrorToastProps } from "../../types/Type";



const ErrorToast = ({ show, message, onClose }: ErrorToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md max-w-md flex items-center">
        <div className="mr-3">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="block">{message}</span>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2"
          aria-label="Close"
        >
          <span className="text-xl">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
