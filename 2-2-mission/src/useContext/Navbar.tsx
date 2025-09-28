import { useTheme } from './context/ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  const { theme } = useTheme();

  console.log(theme);

  return (
    <div>
      <ThemeToggleButton />
    </div>
  );
}