
import { ButtonProps } from "../../types/Type";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium focus:outline-none transition-colors duration-200 ease-in-out";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50",
    outline:
      "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ""}
        ${widthClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
