import { ChevronDown } from "lucide-react";
import { useThemePreference } from "../../hooks/useThemePreference";

const themes = [
  { value: "default", label: "Default" },
  { value: "emerald", label: "Emerald" },
  { value: "valentine", label: "Valentine" },
  { value: "dracula", label: "Dracula" },
  { value: "dim", label: "Dim" },
  { value: "forest", label: "Forest" },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useThemePreference();

  return (
    <>
      <button
        className="btn btn-primary w-full"
        popoverTarget="popoverFull"
        style={{ anchorName: "anchorFull" }}
        aria-label="Select Theme"
      >
        Theme
        <ChevronDown className="size-5 mt-1" />
      </button>

      <ul
        className="dropdown dropdown-center menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popoverFull"
        style={{ positionAnchor: "anchorFull" }}
      >
        {themes.map((item) => (
          <li key={item.value}>
            <input
              type="radio"
              name="theme-dropdown"
              className="btn btn-ghost w-full justify-start"
              aria-label={item.label}
              checked={theme === item.value}
              onChange={() => setTheme(item.value)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ThemeSelector;
