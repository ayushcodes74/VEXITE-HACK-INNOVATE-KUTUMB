import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { familyInfo } from '../data/mockData';
import MemberAvatar from './MemberAvatar';

export default function Navbar({ onOpenMobileMenu }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Hamburger on mobile + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search policies, EMI, electricity bills, or family responsibilities..."
            className="w-full pl-10 pr-12 py-2 bg-slate-900/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Quick Ask AI, Notifications, Family Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Ask KUTUMB Button */}
        <button
          onClick={() => navigate('/ask')}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ask KUTUMB</span>
        </button>

        {/* Urgent Alerts Bell */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all relative"
            title="1 High Priority Item Needs Attention"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse"></span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800/80 hidden sm:block"></div>

        {/* Family Hub Switcher */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex -space-x-2 overflow-hidden">
            {familyInfo.members.map((member) => (
              <div key={member.id} className="inline-block ring-2 ring-slate-950 rounded-full">
                <MemberAvatar member={member} size="sm" />
              </div>
            ))}
          </div>

          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <span>{familyInfo.familyName}</span>
              <span className="text-[10px] text-amber-400 font-semibold">(4)</span>
            </div>
            <div className="text-[10px] text-slate-400">Delhi NCR</div>
          </div>
        </div>
      </div>
    </header>
  );
}
