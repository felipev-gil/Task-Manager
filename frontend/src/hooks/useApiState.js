import { useState } from "react";

export const useApiState = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isSaving, setIsSaving] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState(null);

  return {
    isLoading,
    setIsLoading,

    isSaving,
    setIsSaving,

    isRateLimited,
    setIsRateLimited,

    error,
    setError,
  };
};
