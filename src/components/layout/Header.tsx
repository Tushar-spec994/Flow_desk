import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { stats } = useTasks();
  const location = useLocation();

  const getViewTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'All Tasks';
    if (path === '/tasks/create') return 'Create New Task';
    if (path.startsWith('/tasks/edit/')) return 'Modify Task';
    if (path === '/settings') return 'Settings';
    return 'FlowDesk';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/60 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            {getViewTitle()}
            {location.pathname === '/' && stats.overdue > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-400 dark:text-slate-455">
            Simplify your productivity cycle
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Decorative Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vite Powered</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-805 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition-all"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Avatar Container */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20 select-none">
          TF
        </div>
      </div>
    </header>
  );
};
