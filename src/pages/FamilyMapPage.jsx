import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Users, 
  Shield, 
  Car, 
  Home, 
  Zap, 
  GraduationCap, 
  HeartHandshake, 
  Info, 
  ArrowRight,
  Calendar
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

const OLIVE = '#5a7a4a';
const OLIVE_DIM = 'rgba(90,122,74,0.08)';
const OLIVE_BORDER = 'rgba(90,122,74,0.18)';

export default function FamilyMapPage() {
  const { familyKnowledge, is_empty } = useFamilyKnowledge();
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const getNodeIcon = (title = '', category = '') => {
    const text = `${title} ${category}`.toLowerCase();
    if (text.includes('health') || text.includes('medic') || text.includes('insurance')) {
      return <Shield className="w-4 h-4" style={{ color: '#c0392b' }} />;
    }
    if (text.includes('car') || text.includes('vehicle') || text.includes('motor')) {
      return <Car className="w-4 h-4" style={{ color: '#2980b9' }} />;
    }
    if (text.includes('home') || text.includes('property') || text.includes('tax') || text.includes('house')) {
      return <Home className="w-4 h-4" style={{ color: '#5b5ea6' }} />;
    }
    if (text.includes('electric') || text.includes('power') || text.includes('bill') || text.includes('utility')) {
      return <Zap className="w-4 h-4" style={{ color: '#c08a20' }} />;
    }
    if (text.includes('edu') || text.includes('school') || text.includes('college')) {
      return <GraduationCap className="w-4 h-4" style={{ color: '#27ae60' }} />;
    }
    return <HeartHandshake className="w-4 h-4" style={{ color: '#8e44ad' }} />;
  };

  const getUrgencyBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="high">High Priority</Badge>;
      case 'medium':
        return <Badge variant="medium">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">Scheduled</Badge>;
    }
  };

  const members = familyKnowledge.people || [];

  const filteredMembers = useMemo(() => {
    if (selectedMember === 'all') return members;
    return members.filter((m) => m.name.toLowerCase() === selectedMember.toLowerCase());
  }, [selectedMember, members]);

  // If empty state
  if (is_empty || members.length === 0) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="section-label mb-1">
              <Network className="w-3 h-3" />
              <span>Visual Relationship Graph</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#111111' }}>              Family Knowledge Map
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: '#888888' }}>
              People → Documents → Assets → Responsibilities → Dates.
            </p>
          </div>
        </div>


        <div className="rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4" style={{ border: '1px dashed rgba(0,0,0,0.10)', background: '#F7F4F0' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(192,138,32,0.06)', border: '1px solid rgba(192,138,32,0.12)' }}>
            <Users className="w-7 h-7" style={{ color: '#c08a20' }} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold" style={{ color: '#111111' }}>Your family context is waiting to be built</h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#888888' }}>
              Upload your first family document to begin mapping family members, assets, and shared responsibilities.
            </p>
          </div>
          <Link
            to="/documents"
            className="k-btn-primary inline-flex items-center gap-2"
          >
            <span>Add First Document</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-label mb-1">
            <Network className="w-3 h-3" />
            <span>Visual Relationship Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#111111' }}>
            Family Knowledge Map
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#888888' }}>
            People → Documents → Assets → Responsibilities → Dates.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedMember('all')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: selectedMember === 'all' ? OLIVE_DIM : '#FFFFFF',
              color: selectedMember === 'all' ? OLIVE : '#888888',
              border: `1px solid ${selectedMember === 'all' ? OLIVE_BORDER : 'rgba(0,0,0,0.06)'}`,
              boxShadow: selectedMember === 'all' ? '0 1px 3px rgba(90,122,74,0.08)' : 'none'
            }}
          >
            All Members ({members.length})
          </button>
          {members.map((m) => (
            <button
              key={m.name}
              onClick={() => setSelectedMember(m.name)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: selectedMember.toLowerCase() === m.name.toLowerCase() ? OLIVE_DIM : '#FFFFFF',
                color: selectedMember.toLowerCase() === m.name.toLowerCase() ? OLIVE : '#888888',
                border: `1px solid ${selectedMember.toLowerCase() === m.name.toLowerCase() ? OLIVE_BORDER : 'rgba(0,0,0,0.06)'}`,
                boxShadow: selectedMember.toLowerCase() === m.name.toLowerCase() ? '0 1px 3px rgba(90,122,74,0.08)' : 'none'
              }}
            >
              {m.name.split(' ')[0]}'s Branch
            </button>
          ))}
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl flex items-start gap-3 text-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: '#555555' }}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c08a20' }} />
        <div>
          <strong style={{ color: '#111111' }}>Active Intelligence Graph:</strong> Derived automatically from {familyKnowledge.documents.length} verified documents in your vault.
          <span className="font-mono mx-1" style={{ color: OLIVE }}>
            {familyKnowledge.familyName || 'Family'} Core ➔ {members.map(m => m.name.split(' ')[0]).join(', ')} ➔ {familyKnowledge.responsibilities.length} Responsibilities
          </span>.
        </div>
      </div>

      {/* MAP TREE CONTAINER */}
      <div className="relative p-6 sm:p-10 rounded-2xl overflow-hidden space-y-12" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-100 pointer-events-none map-grid-bg"
        />

        {/* 1. ROOT NODE: FAMILY CORE */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="p-5 rounded-2xl text-center max-w-sm w-full space-y-2 group hover:scale-[1.02] transition-transform" style={{ background: 'linear-gradient(135deg, rgba(90,122,74,0.06) 0%, rgba(90,122,74,0.02) 100%)', border: `1px solid ${OLIVE_BORDER}`, boxShadow: '0 4px 24px -8px rgba(90,122,74,0.10)' }}>
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center shadow-sm" style={{ background: OLIVE_DIM, border: `1px solid ${OLIVE_BORDER}` }}>
              <Users className="w-6 h-6 stroke-[2]" style={{ color: OLIVE }} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: OLIVE }}>
                Central Family Core
              </span>
              <h2 className="text-xl font-extrabold" style={{ color: '#111111' }}>
                {familyKnowledge.familyName || 'Family'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#888888' }}>
                {members.length} Members · {familyKnowledge.responsibilities.length} Obligations · {familyKnowledge.entities.length} Entities
              </p>
            </div>
          </div>

          {/* Stem connector */}
          <div className="w-0.5 h-10" style={{ background: `linear-gradient(to bottom, ${OLIVE}60, #D5D0CA)` }}></div>
          <div className="w-3 h-3 rounded-full ring-4" style={{ background: OLIVE, ringColor: 'rgba(90,122,74,0.15)' }}></div>
        </div>

        {/* 2. FAMILY MEMBERS LAYER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {filteredMembers.map((member) => {
            // Find responsibilities for this member
            const memberResponsibilities = familyKnowledge.responsibilities.filter((r) => {
              const assigned = (r.assigned_to || '').toLowerCase();
              const shared = Array.isArray(r.shared_with) ? r.shared_with.map(s => String(s).toLowerCase()) : [];
              const mName = member.name.toLowerCase();
              const mFirst = mName.split(' ')[0];
              return assigned.includes(mFirst) || shared.some(s => s.includes(mFirst));
            });

            return (
              <div key={member.name} className="flex flex-col items-center space-y-6">
                
              {/* Member Card */}
              <div className={`w-full p-4 rounded-xl text-center space-y-2 relative ${
                memberResponsibilities.filter(r => r.priority === 'high').length > 0
                  ? 'shadow-md'
                  : ''
              }`} style={{
                background: '#FFFFFF',
                border: memberResponsibilities.filter(r => r.priority === 'high').length > 0
                  ? '1px solid rgba(192,57,43,0.15)'
                  : '1px solid rgba(0,0,0,0.06)',
                borderLeft: memberResponsibilities.filter(r => r.priority === 'high').length > 0
                  ? '4px solid #c0392b'
                  : memberResponsibilities.length > 0
                  ? `4px solid ${OLIVE}60`
                  : '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <div className="flex justify-center -mt-8">
                  <div className="p-1 rounded-full ring-2 ring-white" style={{ background: '#FFFFFF' }}>
                    <MemberAvatar
                      member={{
                        name: member.name,
                        id: member.name.toLowerCase().replace(/\s+/g, '-'),
                        activeAlerts: memberResponsibilities.filter(r => r.priority === 'high').length
                      }}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="font-bold text-sm sm:text-base" style={{ color: '#111111' }}>
                    {member.name}
                  </h3>
                  <span className="text-[11px] font-medium block capitalize" style={{ color: OLIVE }}>
                    {member.roles?.join(' · ') || 'Family Member'}
                  </span>
                </div>

                <div className="text-[11px] pt-2 flex items-center justify-center gap-1.5" style={{ color: '#888888', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <span className={`w-2 h-2 rounded-full ${
                    memberResponsibilities.filter(r => r.priority === 'high').length > 0 ? '' : ''
                  }`} style={{ background: memberResponsibilities.filter(r => r.priority === 'high').length > 0 ? '#c0392b' : '#27ae60' }}></span>
                  <span>{memberResponsibilities.length} Linked Obligations</span>
                </div>
              </div>

              {/* Vertical link connector */}
              <div className="w-0.5 h-6" style={{ background: '#D5D0CA' }}></div>

              {/* RESPONSIBILITY / ASSET CARDS UNDER THIS MEMBER */}
              <div className="w-full space-y-3">
                {memberResponsibilities.length === 0 ? (
                  <div className="p-4 rounded-xl text-center text-xs" style={{ background: '#F7F4F0', border: '1px dashed rgba(0,0,0,0.08)', color: '#AAAAAA' }}>
                    No direct obligations linked yet
                  </div>
                ) : (
                  memberResponsibilities.map((resp) => (
                    <div
                      key={resp.id}
                      onClick={() => setSelectedNode(resp)}
                      className="cursor-pointer rounded-xl p-3 space-y-2 transition-all group"
                      style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(90,122,74,0.25)'; e.currentTarget.style.background = '#FFFFFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.background = '#FAFAF8'; }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg group-hover:scale-105 transition-transform shrink-0" style={{ background: '#F0EDE8', border: '1px solid rgba(0,0,0,0.04)' }}>
                            {getNodeIcon(resp.title, resp.category)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold leading-snug group-hover:underline" style={{ color: '#333333' }}>
                              {resp.title}
                            </h4>
                            <span className="text-[10px]" style={{ color: '#AAAAAA' }}>
                              {resp.category || 'Obligation'}
                            </span>
                          </div>
                        </div>

                        {getUrgencyBadge(resp.priority)}
                      </div>

                      {(resp.due_date || resp.amount) && (
                        <div className="flex items-center gap-2 text-[10px]">
                          {resp.due_date && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: '#F0EDE8', border: '1px solid rgba(0,0,0,0.04)', color: '#555555' }}>
                              <Calendar className="w-3 h-3" style={{ color: '#c08a20' }} />
                              {resp.due_date}
                            </span>
                          )}
                          {resp.amount && (
                            <span className="px-2 py-0.5 rounded-md font-bold" style={{ background: 'rgba(192,138,32,0.06)', border: '1px solid rgba(192,138,32,0.12)', color: '#c08a20' }}>
                              {resp.amount}
                            </span>
                          )}
                        </div>
                      )}

                      {resp.why_this_matters && (
                        <p className="text-[10px] leading-snug line-clamp-2" style={{ color: '#AAAAAA' }}>
                          {resp.why_this_matters}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#888888' }}>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold" style={{ color: '#555555' }}>Responsibility Status:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#c0392b' }}></span> High Priority (≤14 days)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#c08a20' }}></span> Upcoming (≤30 days)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27ae60' }}></span> Completed / Paid
            </span>
          </div>

          <div className="text-[11px]" style={{ color: '#AAAAAA' }}>
            Live Cross-Document Graph · {familyKnowledge.documents.length} Source Documents Connected
          </div>
        </div>
      </div>
    </div>
  );
}
