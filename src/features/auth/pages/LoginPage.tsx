import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Button } from "../../../components/ui/Button";

type FormTab = "login" | "register";

export const LoginPage: React.FC = () => {
  const { currentUser, login, registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<FormTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password");

  const handleTabChange = (tab: FormTab) => {
    setActiveTab(tab);
    setErrorMessage(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    setErrorMessage(null);
    try {
      if (activeTab === "login") {
        await login(data.username, data.password);
        showToast(`Welcome back, ${data.username}!`, "success");
      } else {
        await registerUser(data.username, data.password);
        showToast(
          `Account registered successfully. Welcome, ${data.username}!`,
          "success",
        );
      }
      navigate("/");
    } catch (err: any) {
      setErrorMessage(
        err.message || "An error occurred during authentication.",
      );
      showToast(err.message || "Authentication failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-400/10 dark:bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805/70 rounded-3xl p-6 md:p-8 shadow-xl relative z-10"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-550/20 mb-4">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-850 dark:text-slate-100 select-none">
            FlowDesk
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-455 font-medium mt-1 select-none">
            Log in to manage and isolate your private tasks.
          </p>
        </div>

        {/* Action tabs */}
        <div className="grid grid-cols-2 bg-slate-100/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-805/40 p-1 rounded-xl mb-6">
          <button
            onClick={() => handleTabChange("login")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "login"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange("register")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "register"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-455 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message box */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-950/30 p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-700 dark:text-rose-400 font-medium leading-relaxed">
                  {errorMessage}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="e.g. tushar"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Alphanumeric characters only",
                  },
                })}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:border-slate-805 dark:focus:border-indigo-500 transition-all ${
                  errors.username
                    ? "border-rose-550 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-805"
                }`}
              />
            </div>
            {errors.username && (
              <span className="text-xs text-rose-550 font-medium">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:border-slate-805 dark:focus:border-indigo-500 transition-all ${
                  errors.password
                    ? "border-rose-550 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-805"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-550 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password (only on Sign Up) */}
          <AnimatePresence>
            {activeTab === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-1.5"
              >
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...register("confirmPassword", {
                        required:
                          activeTab === "register"
                            ? "Please confirm your password"
                            : false,
                        validate: (val) => {
                          if (activeTab === "register" && val !== passwordVal) {
                            return "Passwords do not match";
                          }
                          return true;
                        },
                      })}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:border-slate-805 dark:focus:border-indigo-500 transition-all ${
                        errors.confirmPassword
                          ? "border-rose-550 focus:ring-rose-500/20"
                          : "border-slate-200 dark:border-slate-805"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-xs text-rose-550 font-medium">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 mt-6 font-bold shadow-md shadow-indigo-600/10 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {activeTab === "login"
                    ? "Authenticating..."
                    : "Creating account..."}
                </span>
              </>
            ) : (
              <span>
                {activeTab === "login" ? "Sign In" : "Register Account"}
              </span>
            )}
          </Button>
        </form>

        {/* Demo Tip */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 text-center select-none">
          <p className="text-[10px] text-slate-450 leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline mr-1" />
            Registered users and tasks are securely persistent inside your
            browser's private local storage sandbox.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
