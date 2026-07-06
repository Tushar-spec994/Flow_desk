import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Database,
  RefreshCw,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useTasks } from "../../../context/TaskContext";
import { useToast } from "../../../context/ToastContext";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { stats, resetTasks } = useTasks();
  const { showToast } = useToast();

  const handleResetData = () => {
    if (
      window.confirm(
        "WARNING: This will delete ALL current tasks and restore the default demo tasks. Are you sure you want to proceed?",
      )
    ) {
      resetTasks();
      showToast(
        "Database reset successfully. Scaffolded mock tasks restored!",
        "info",
      );
    }
  };

  const clearLocalStorage = () => {
    if (
      window.confirm(
        "DANGER: This will wipe out all tasks and configurations, restoring the app to an empty state. Are you sure?",
      )
    ) {
      window.localStorage.clear();
      showToast(
        "Local Storage cleared completely. Refreshing app...",
        "warning",
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100">
          Preferences & Database Settings
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-455">
          Configure appearance, view database metrics, and manage application
          storage.
        </p>
      </div>

      {/* Theme Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205 mb-4">
          Appearance Theme
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Toggle between Light and Dark mode options. Your choice is
          automatically persisted.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Button */}
          <button
            onClick={() => theme === "dark" && toggleTheme()}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-28 relative transition-all ${
              theme === "light"
                ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs"
                : "border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            {theme === "light" && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-600" />
            )}
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Light Mode
              </span>
              <span className="text-[10px] font-medium text-slate-405">
                Clean and bright
              </span>
            </div>
          </button>

          {/* Dark Theme Button */}
          <button
            onClick={() => theme === "light" && toggleTheme()}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-28 relative transition-all ${
              theme === "dark"
                ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs"
                : "border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            {theme === "dark" && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-500" />
            )}
            <Moon className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Dark Mode
              </span>
              <span className="text-[10px] font-medium text-slate-405">
                Easy on the eyes
              </span>
            </div>
          </button>
        </div>
      </Card>

      {/* Database Management Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" /> Database
          Administration
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          View storage metadata and control task synchronization profiles.
        </p>

        {/* Stats Grid */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-805/50 rounded-2xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center sm:text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <span className="text-lg font-black text-slate-850 dark:text-slate-100">
              {stats.total}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <span className="text-lg font-black text-slate-850 dark:text-slate-100">
              {stats.completed}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Storage Engine
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              LocalStorage
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sync State
            </span>
            <span className="text-xs font-bold text-emerald-650 dark:text-emerald-450 flex items-center justify-center sm:justify-start gap-1">
              <CheckCircle className="w-3.5 h-3.5 inline" /> Local Sync
            </span>
          </div>
        </div>

        {/* Danger Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleResetData}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-205 dark:border-slate-805 bg-white dark:bg-slate-900 font-bold"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Default Demo Tasks</span>
          </Button>

          <Button
            variant="danger"
            onClick={clearLocalStorage}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold"
          >
            <span>Wipe All Storage</span>
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 flex gap-4 items-start bg-indigo-50/20 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-950/20">
        <HelpCircle className="w-5 h-5 text-indigo-650 dark:text-indigo-450 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
            About FlowDesk Local Database
          </h4>
          <p className="text-[11px] leading-relaxed text-indigo-950/70 dark:text-indigo-305/70 mt-1">
            This application is constructed entirely on front-end components.
            All task records, modifications, categories, and configuration
            settings are stored inside your browser's private Sandboxed Local
            Storage. No data is transmitted over the internet or sent to
            external servers. Clearing browser cookies or cache for this domain
            will restore the database to empty defaults.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
