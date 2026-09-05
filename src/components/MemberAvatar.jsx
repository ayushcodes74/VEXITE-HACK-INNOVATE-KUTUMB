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
        return 'from-amber-500 to-orange-500';
      case 'sunita':
        return 'from-rose-400 to-pink-500';
      case 'aarav':
        return 'from-blue-400 to-cyan-500';
      case 'ananya':
        return 'from-emerald-400 to-teal-500';
      case 'both':
        return 'from-indigo-400 to-purple-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const initials = member.initials || getInitials(member.name);
  const gradient = getGradient(member.id || member.memberId);

  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr text-white font-semibold shadow-sm ring-2 ring-white shrink-0 ${sizeClasses[size] || sizeClasses.md} ${gradient}`}
        title={`${member.name || 'Member'}${member.relation ? ` (${member.relation})` : ''}`}
      >
        <span>{initials}</span>
        {member.activeAlerts > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse" style={{ background: '#c0392b' }}></span>
        )}
      </div>

      {(showName || showRole) && (
        <div className="flex flex-col">
          {showName && (
            <span className="text-sm font-medium leading-tight" style={{ color: '#1a1a1a' }}>
              {member.name}
            </span>
          )}
          {showRole && (
            <span className="text-xs leading-tight" style={{ color: '#888888' }}>
              {member.role || member.relation}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
