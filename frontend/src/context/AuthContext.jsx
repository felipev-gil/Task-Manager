import { createContext, useState, useEffect, useContext } from "react";
import * as authService from "../services/auth.service";
import { useApiState } from "../hooks/useApiState";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const { isLoading, setIsLoading, error, setError } = useApiState(true);

  useEffect(() => {
    const fetchInitialUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();

        setUser(userData);

        setError(null);
      } catch {
        setError("Session expired or failed to load user data.");

        localStorage.removeItem("token");

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialUser();
  }, [setError, setIsLoading]);

  const saveUser = (userData, token) => {
    localStorage.setItem("token", token);

    setUser(userData);

    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);

    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        loading: isLoading,
        error,

        saveUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
