import { createContext, useContext, useState, type PropsWithChildren, type ReactElement } from 'react';

export const THEME = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
} as const;

type ITheme = (typeof THEME)[keyof typeof THEME];

interface IThemeContext {
  theme: ITheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [theme, setTheme] = useState<ITheme>(THEME.LIGHT);

  const toggleTheme = (): void => {
    setTheme((prevTheme): ITheme =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};