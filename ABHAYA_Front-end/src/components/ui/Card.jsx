import React from 'react';

export default function Card({ children, className = '', header, footer, title, subtitle, action }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-xs ${className}`}>
      {(header || title) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            {header}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}
