import React from 'react';

type BadgeType = 'priority' | 'status' | 'category' | 'default';

interface BadgeProps {
  children: string;
  type?: BadgeType;
  value?: string; // If value is passed, it matches standard strings for color styling
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'default',
  value,
  className = '',
}) => {
  const checkValue = (value || children).toLowerCase();
  
  let styles = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';

  if (type === 'priority') {
    if (checkValue === 'high') {
      styles = 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-950/30';
    } else if (checkValue === 'medium') {
      styles = 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-950/30';
    } else if (checkValue === 'low') {
      styles = 'bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/20 dark:text-sky-450 dark:border-sky-950/30';
    }
  } else if (type === 'status') {
    if (checkValue === 'completed') {
      styles = 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-950/30';
    } else if (checkValue === 'in-progress') {
      styles = 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-950/30';
    } else if (checkValue === 'todo') {
      styles = 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800/40';
    }
  } else if (type === 'category') {
    const categoryStyles: Record<string, string> = {
      work: 'bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-950/30',
      personal: 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800/40',
      study: 'bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-950/30',
      shopping: 'bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-950/30',
      health: 'bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-950/30',
      other: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800/40',
    };
    styles = categoryStyles[checkValue] || styles;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none capitalize ${styles} ${className}`}
    >
      {children}
    </span>
  );
};
