import toast from "react-hot-toast";

export const handleApiError = (
  error,
  fallbackMessage = "Something went wrong",
) => {
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach((msg) => {
      toast.error(msg);
    });

    return;
  }

  toast.error(error.response?.data?.message || fallbackMessage);
};
