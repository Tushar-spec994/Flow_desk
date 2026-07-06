import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline = false, rows = 3, className = '', ...props }, ref) => {
    const inputStyles = `w-full px-4 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:border-slate-800 dark:focus:border-indigo-500 transition-all ${
      error
        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-slate-200 dark:border-slate-800'
    } ${className}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={inputStyles}
            {...(props as any)}
          />
        ) : (
          <input
            ref={ref as any}
            className={inputStyles}
            {...props}
          />
        )}
        {error && (
          <span className="text-xs text-rose-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
