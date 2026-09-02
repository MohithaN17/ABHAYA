import React from 'react';

export default function Button({
  children,
  variant = 'primary', // primary | secondary | outline | danger | ghost
  size = 'md', // sm | md | lg
  icon: Icon,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 border border-slate-200",
    outline: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus:ring-slate-400 shadow-xs",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 shadow-sm",
    success: "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-700 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400"
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
