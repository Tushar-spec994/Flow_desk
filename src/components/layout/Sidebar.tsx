import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Settings,
  X,
  LogOut,
  Sparkles,
  Layers,
  User,
} from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { stats } = useTasks();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const menuItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: "/tasks",
      label: "All Tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      end: false,
    },
    {
      to: "/tasks/create",
      label: "Create Task",
      icon: <PlusCircle className="w-4 h-4" />,
      end: true,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      end: true,
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of your session?")) {
      logout();
      showToast("Logged out successfully.", "info");
      navigate("/login");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-slate-900 text-slate-100 dark:bg-slate-950 dark:border-r dark:border-slate-900/60 p-5">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-650/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FlowDesk
              </span>
              <span className="block text-[9px] font-bold text-indigo-400 tracking-widest uppercase">
                Productivity
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-405 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Info Badge */}
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-850 dark:bg-slate-900/40 border border-slate-800 dark:border-slate-900/40 rounded-2xl mb-6">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Active User
              </span>
              <span className="block text-xs font-extrabold text-slate-200 truncate capitalize">
                {currentUser.username}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.to === "/tasks" &&
                      stats.todo + stats.inProgress > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {stats.todo + stats.inProgress}
                        </span>
                      )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        {/* Overdue alert banner */}
        {stats.overdue > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/25 p-3.5 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-bold text-rose-455 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-400" /> Action Required
            </span>
            <p className="text-xs text-rose-200/90 font-medium">
              You have {stats.overdue} overdue task
              {stats.overdue > 1 ? "s" : ""}!
            </p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-rose-950/40 hover:border-rose-900 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 hover:text-rose-200 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

        {/* Copy / Version info */}
        <div className="text-[10px] text-slate-500 font-semibold text-center select-none">
          FlowDesk v1.1.0
        </div>
      </div>
    </div>
  );
};
