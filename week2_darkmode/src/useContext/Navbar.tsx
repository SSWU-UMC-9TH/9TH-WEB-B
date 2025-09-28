import ThemeToggleButton from '../context/ThemeToggleButton';
import { useTheme } from '../context/ThemeProvider';

export default function Navbar() {
  const { theme } = useTheme();
  console.log('현재 테마:', theme);

  return (
    <div className="p-4 flex justify-end">
      <ThemeToggleButton />
    </div>
  );
}
