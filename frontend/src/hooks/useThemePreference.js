import { useSyncExternalStore } from "react";
const subscribe = (callback) => {
  window.addEventListener("theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("theme-change", callback);
    window.removeEventListener("storage", callback);
  };
};
const getTheme = () => localStorage.getItem("theme") || "lofi";
export const useThemePreference = () => {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "lofi");
  const setTheme = (value) => {
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute("data-theme", value);
    window.dispatchEvent(new Event("theme-change"));
  };
  return { theme, setTheme };
};
