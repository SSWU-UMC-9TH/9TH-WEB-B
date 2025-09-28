import { THEME, useTheme } from "./ThemeProvider";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === THEME.LIGHT;

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700"
    >
      {isLight ? "다크모드" : "라이트모드"}
    </button>
  );
}
