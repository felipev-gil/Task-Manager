import { useThemePreference } from "../../hooks/useThemePreference";
const themes = ["lofi", "emerald", "valentine", "dracula", "dim", "forest"];
const ThemeSelector = () => {
  const { theme, setTheme } = useThemePreference();
  return (
    <label className="flex items-center gap-2">
      Theme
      <select
        aria-label="Theme"
        className="select select-primary"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {themes.map((value) => (
          <option key={value} value={value}>
            {value === "lofi" ? "Default" : value}
          </option>
        ))}
      </select>
    </label>
  );
};
export default ThemeSelector;
