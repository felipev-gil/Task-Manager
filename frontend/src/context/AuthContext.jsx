import { useState, useEffect, useCallback } from "react";
import * as authService from "../services/auth.service";
import { AuthContext } from "./auth";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    // Remove legacy browser-readable credentials during the cookie migration.
    localStorage.removeItem("token");
    const expired = () => {
      if (active) {
        setUser(null);
        setError(null);
      }
    };
    window.addEventListener("session-expired", expired);
    authService
      .getMe()
      .then((data) => {
        if (active) {
          setUser(data);
          setError(null);
        }
      })
      .catch((failure) => {
        if (active) {
          setUser(null);
          setError(
            failure.response?.status === 401
              ? null
              : "We couldn't connect to the server. Please retry.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      window.removeEventListener("session-expired", expired);
    };
  }, [attempt]);
  const saveUser = (data) => {
    setUser(data);
    setError(null);
  };
  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setError(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, error, saveUser, handleLogout, retry }}
    >
      {children}
    </AuthContext.Provider>
  );
};
