import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sparkles, Bell } from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';

export default function Navbar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { familyKnowledge } = useFamilyKnowledge();
  const urgentCount = (familyKnowledge?.needsAttention || []).length;

  return (
    <header
      className="sticky top-0 z-30 h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
      style={{
        background: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}
    >
      {/* Left: hamburger + brand wordmark on mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1.5 rounded-lg hover:bg-[#F0EDE8] lg:hidden transition-colors focus-ring"
          style={{ color: '#555555' }}
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile brand */}
        <div className="lg:hidden flex items-baseline gap-1.5">
          <span className="text-base font-black tracking-tight" style={{ color: '#111111' }}>KUTUMB</span>
          <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: 'rgba(90,122,74,0.08)', color: '#5a7a4a', border: '1px solid rgba(90,122,74,0.18)' }}>OS</span>
        </div>
      </div>

      {/* Right: Ask + bell */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/ask')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer focus-ring hover:brightness-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #5a7a4a 0%, #4a6a3a 100%)',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px -2px rgba(90,122,74,0.3)'
          }}
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Ask KUTUMB</span>
        </button>

        {/* Alert bell */}
        <div className="relative">
          <button
            className="p-2 rounded-xl hover:bg-[#F0EDE8] transition-colors relative focus-ring"
            style={{ color: '#888888' }}
            title={urgentCount > 0 ? `${urgentCount} item needs attention` : 'No alerts'}
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-2 ring-white animate-pulse" style={{ background: '#c0392b' }} />
            )}
          </button>
        </div>

        <div className="h-5 w-px hidden sm:block" style={{ background: 'rgba(0,0,0,0.08)' }} />

        {/* Family initials pill */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-default"
          style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="flex -space-x-1.5">
            {['RS','SS','AS','An'].map((init, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ring-2 ring-white"
                style={{
                  background: ['#c08a20','#c0392b','#2980b9','#27ae60'][i],
                  color: '#FFFFFF'
                }}
              >
                {init}
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold" style={{ color: '#555555' }}>Sharma</span>
        </div>
      </div>
    </header>
  );
}
