import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Network, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  X, 
  ChevronRight,
  Home
} from 'lucide-react';
import { familyInfo } from '../data/mockData';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    {
      label: 'Overview',
      to: '/',
      icon: LayoutDashboard,
      badge: '1 Action',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      label: 'Documents',
      to: '/documents',
      icon: FileText,
      badge: '6 Files',
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700'
    },
    {
      label: 'Family Map',
      to: '/family-map',
      icon: Network,
      badge: '4 Members',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
    },
    {
      label: 'Ask KUTUMB',
      to: '/ask',
      icon: Sparkles,
      badge: 'AI Assistant',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 lg:bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  KUTUMB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  MAP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Family Knowledge & Responsibility
              </p>
            </div>
          </NavLink>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Family Pill Switcher info */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{familyInfo.familyName}</p>
              <p className="text-[10px] text-slate-400">4 Active Members</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" title="Active Hub"></span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tagline & Family Security Badge footer */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Shared Family Trust</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "Because family knowledge shouldn't live in one person's head."
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80">
              <span>Synced: {familyInfo.lastSynced}</span>
              <span className="text-emerald-400 font-medium">100% Private</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
