import { useTheme } from '../../context/ThemeContext';

/**
 * Theme Switcher component — Terminal style toggle
 */
export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="theme-switcher__icon" aria-hidden="true">
        {theme === 'dark' ? '☀' : '☾'}
      </span>
      <span className="theme-switcher__label">
        {theme === 'dark' ? 'light' : 'dark'}
      </span>
    </button>
  );
}