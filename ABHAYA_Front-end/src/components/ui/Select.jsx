import React from 'react';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 hover:border-slate-400 transition-colors ${
            Icon ? 'pl-9' : 'pl-3.5'
          } pr-8 py-2 appearance-none cursor-pointer`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
