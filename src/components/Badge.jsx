import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3 py-1.5 rounded-lg font-semibold',
  };

  const variantClasses = {
    high: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    medium: 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    low: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    completed: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    info: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide transition-colors ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {variant === 'high' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
      )}
      {children}
    </span>
  );
}
