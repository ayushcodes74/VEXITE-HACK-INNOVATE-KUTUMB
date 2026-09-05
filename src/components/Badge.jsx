import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3 py-1.5 rounded-lg font-semibold',
  };

  const variantClasses = {
    high: 'bg-[rgba(192,57,43,0.06)] text-[#c0392b] border border-[rgba(192,57,43,0.15)]',
    medium: 'bg-[rgba(192,138,32,0.06)] text-[#c08a20] border border-[rgba(192,138,32,0.15)]',
    low: 'bg-[rgba(41,128,185,0.06)] text-[#2980b9] border border-[rgba(41,128,185,0.15)]',
    success: 'bg-[rgba(39,174,96,0.06)] text-[#27ae60] border border-[rgba(39,174,96,0.15)]',
    completed: 'bg-[rgba(39,174,96,0.06)] text-[#27ae60] border border-[rgba(39,174,96,0.15)]',
    warning: 'bg-[rgba(192,138,32,0.06)] text-[#c08a20] border border-[rgba(192,138,32,0.15)]',
    info: 'bg-[rgba(91,94,166,0.06)] text-[#5b5ea6] border border-[rgba(91,94,166,0.15)]',
    default: 'bg-[#F0EDE8] text-[#666666] border border-[rgba(0,0,0,0.06)]',
    purple: 'bg-[rgba(91,94,166,0.06)] text-[#5b5ea6] border border-[rgba(91,94,166,0.15)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide transition-colors ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {variant === 'high' && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c0392b' }}></span>
      )}
      {children}
    </span>
  );
}
