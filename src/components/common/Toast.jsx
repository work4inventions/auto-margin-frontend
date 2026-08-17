import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Success toast
export const showSuccessToast = (message) => {
  toast.success(message);
};

// Error toast
export const showErrorToast = (message) => {
  toast.error(message);
};

// Warning toast
export const showWarningToast = (message) => {
  toast.warning(message);
};

// Info toast
export const showInfoToast = (message) => {
  toast.info(message);
};

// Common error handler
export const handleError = (error, defaultMessage = "An error occurred") => {
  const errorMessage =
    error?.message || error?.response?.data?.message || defaultMessage;
  showErrorToast(errorMessage);
  console.error("Error:", error);
};

// Common success handler
export const handleSuccess = (
  message = "Operation completed successfully"
) => {
  showSuccessToast(message);
};

// Optional: Dummy component if you want to import default
const Toast = () => null;

export default Toast;
