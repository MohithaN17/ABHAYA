import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  icon: Icon,
  helperText,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
            Icon ? 'pl-9' : 'pl-3.5'
          } pr-3.5 py-2 ${
            error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 hover:border-slate-400'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
