import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex items-center justify-center gap-1.5 p-1.5 sm:p-2 rounded-editorial transition-all text-[#585F5A] hover:text-[#202520] hover:bg-[#F7F8F7] border border-[#E8ECE9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43866A] ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-[#585F5A] transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-medium text-[#202520]">
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </span>
      )}
    </button>
  );
};

