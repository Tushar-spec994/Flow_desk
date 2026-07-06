import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-5 shadow-sm ${
        hoverable
          ? 'hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
