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
  Leaf
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import { familyInfo } from '../data/mockData';

export default function Sidebar({ isOpen, onClose }) {
  const { familyKnowledge, analyzedDocuments } = useFamilyKnowledge();
  const {
    people = [],
    needsAttention = [],
  } = familyKnowledge;

  const docCount = analyzedDocuments.length;
  const memberCount = people.length;
  const urgentCount = needsAttention.length;

  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
      badge: urgentCount > 0 ? `${urgentCount} Action${urgentCount !== 1 ? 's' : ''}` : null,
      badgeVariant: 'rose'
    },
    {
      label: 'Documents',
      to: '/documents',
      icon: FileText,
      badge: docCount > 0 ? `${String(docCount).padStart(2, '0')} Docs` : '0 Docs',
      badgeVariant: 'muted'
    },
    {
      label: 'Family Map',
      to: '/family-map',
      icon: Network,
      badge: memberCount > 0 ? `${String(memberCount).padStart(2, '0')} Members` : '—',
      badgeVariant: 'olive'
    },
    {
      label: 'Ask KUTUMB',
      to: '/ask',
      icon: Sparkles,
      badge: 'AI',
      badgeVariant: 'amber'
    },
  ];

  const badgeClass = {
    rose:  'bg-[rgba(192,57,43,0.06)] text-[#c0392b] border-[rgba(192,57,43,0.15)]',
    muted: 'bg-[#F0EDE8] text-[#888888] border-[rgba(0,0,0,0.06)]',
    olive: 'bg-[rgba(90,122,74,0.08)] text-[#5a7a4a] border-[rgba(90,122,74,0.18)]',
    amber: 'bg-[rgba(192,138,32,0.08)] text-[#c08a20] border-[rgba(192,138,32,0.18)]',
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.08)' : 'none'
        }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="group flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(90,122,74,0.1)', border: '1px solid rgba(90,122,74,0.2)' }}
            >
              <Leaf className="w-4.5 h-4.5" style={{ color: '#5a7a4a' }} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black tracking-tight" style={{ color: '#111111' }}>KUTUMB</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(90,122,74,0.08)', color: '#5a7a4a', border: '1px solid rgba(90,122,74,0.18)' }}
                >
                  OS
                </span>
              </div>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: '#888888' }}>Family Knowledge</p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0EDE8] lg:hidden transition-colors"
            style={{ color: '#888888' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Family context pill */}
        <div className="mx-4 mb-4 px-3.5 py-2.5 rounded-xl" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(90,122,74,0.08)', border: '1px solid rgba(90,122,74,0.15)' }}>
                <Users className="w-3.5 h-3.5" style={{ color: '#5a7a4a' }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#1a1a1a' }}>{familyInfo.familyName}</p>
                <p className="text-[10px]" style={{ color: '#888888' }}>{memberCount || 4} Members{docCount > 0 ? ' · Active' : ''}</p>
              </div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#27ae60' }} />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#AAAAAA' }}>Workspace</p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive ? 'nav-link-active' : 'nav-link-idle'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className="w-4 h-4 shrink-0 transition-colors"
                        style={isActive ? { color: '#5a7a4a' } : {}}
                      />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${badgeClass[item.badgeVariant]}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className="w-3 h-3 transition-all"
                        style={isActive ? { color: '#5a7a4a', transform: 'translateX(1px)' } : { color: 'transparent' }}
                      />
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: tagline */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="px-3 py-3 rounded-xl" style={{ background: 'rgba(90,122,74,0.04)', border: '1px solid rgba(90,122,74,0.1)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#5a7a4a' }} />
              <span className="text-xs font-bold" style={{ color: '#5a7a4a' }}>Family Trust Layer</span>
            </div>
            <p className="text-[10px] leading-relaxed italic" style={{ color: '#888888' }}>
              "Family knowledge shouldn't live in one person's head."
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 text-[9px]" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', color: '#AAAAAA' }}>
              <span>Synced: {familyInfo.lastSynced}</span>
              <span style={{ color: '#5a7a4a' }} className="font-semibold">Private</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
