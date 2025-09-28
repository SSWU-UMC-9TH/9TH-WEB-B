import ThemeToggleButton from "../context/ThemeToggleButton";
import { ThemeProvider } from "../context/ThemeProvider";

export default function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex items-center justify-center min-h-screen 
                      bg-white dark:bg-blue-900 transition-colors duration-500">
        <ThemeToggleButton />
      </div>
    </ThemeProvider>
  );
}
