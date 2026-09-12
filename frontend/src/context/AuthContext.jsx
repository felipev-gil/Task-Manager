import { createContext, useState, useEffect, useContext } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext(null);
// The context and its consumer hook intentionally live together.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!localStorage.getItem("token")) return;
        const data = await authService.getMe();
        if (active) setUser(data);
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setError(
            error.response?.status === 429
              ? "Too many requests. Please wait a moment, then retry."
              : "We couldn't connect to load your session. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    initialize();
    return () => {
      active = false;
    };
  }, [attempt]);

  const saveUser = (data, token) => {
    localStorage.setItem("token", token);
    setUser(data);
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
        loading,
        error,
        saveUser,
        handleLogout,
        retry: () => setAttempt((value) => value + 1),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
