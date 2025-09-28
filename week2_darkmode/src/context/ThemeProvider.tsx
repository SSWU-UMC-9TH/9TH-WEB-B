import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";

export enum THEME {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

interface IThemeContext {
  theme: THEME;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<THEME>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  useEffect(() => {
    if (theme === THEME.DARK) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
