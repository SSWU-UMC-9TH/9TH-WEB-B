import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

// ✅ enum 대신 상수 객체 + 리터럴 유니언
export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;
type TTheme = typeof THEME[keyof typeof THEME];

type ThemeCtx = { theme: TTheme; toggleTheme: () => void };

const Ctx = createContext<ThemeCtx | undefined>(undefined);

function getInitialTheme(): TTheme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === THEME.LIGHT || saved === THEME.DARK) return saved as TTheme;
  } catch {}
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  return prefersDark ? THEME.DARK : THEME.LIGHT;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<TTheme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME.DARK);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(t => (t === THEME.DARK ? THEME.LIGHT : THEME.DARK)),
    }),
    [theme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("ThemeProvider로 App을 감싸주세요.");
  return v;
}
