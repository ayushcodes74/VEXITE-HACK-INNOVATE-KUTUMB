import React from 'react';

export default function MemberAvatar({ member, size = 'md', showName = false, showRole = false }) {
  if (!member) return null;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  const getInitials = (name) => {
    if (!name) return 'FM';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return name.slice(0, 2).toUpperCase();
  };

  const getGradient = (id) => {
    switch (id) {
      case 'rajesh':
        return 'from-amber-500 to-orange-600 shadow-orange-500/20';
      case 'sunita':
        return 'from-rose-500 to-pink-600 shadow-pink-500/20';
      case 'aarav':
        return 'from-blue-500 to-cyan-600 shadow-blue-500/20';
      case 'ananya':
        return 'from-emerald-500 to-teal-600 shadow-emerald-500/20';
      case 'both':
        return 'from-purple-500 to-indigo-600 shadow-indigo-500/20';
      default:
        return 'from-slate-600 to-slate-800 shadow-slate-700/20';
    }
  };

  const initials = member.initials || getInitials(member.name);
  const gradient = getGradient(member.id || member.memberId);

  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr text-white font-semibold shadow-md ring-2 ring-slate-800/80 shrink-0 ${sizeClasses[size] || sizeClasses.md} ${gradient}`}
        title={`${member.name || 'Member'}${member.relation ? ` (${member.relation})` : ''}`}
      >
        <span>{initials}</span>
        {member.activeAlerts > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
        )}
      </div>

      {(showName || showRole) && (
        <div className="flex flex-col">
          {showName && (
            <span className="text-sm font-medium text-slate-200 leading-tight">
              {member.name}
            </span>
          )}
          {showRole && (
            <span className="text-xs text-slate-400 leading-tight">
              {member.role || member.relation}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
