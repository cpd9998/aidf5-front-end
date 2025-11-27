// utils/handleApiError.js
import { toast } from "sonner";

export const handleApiError = (error) => {
  const message = extractErrorMessage(error);
  toast.error(message);
};

// Internal error extractor
export const extractErrorMessage = (error) => {
  if (!error) return "Something went wrong";

  // RTK Query error (fetchBaseQuery)
  if (error.status) {
    if (error?.data?.message) return error.data.message;

    // Array of validation errors
    if (Array.isArray(error?.data?.errors)) {
      return error.data.errors.map((e) => e.message).join(", ");
    }

    return `Request failed with status ${error.status}`;
  }

  // Network errors
  if (error?.error) return error.error;

  return "Unexpected error occurred";
};
