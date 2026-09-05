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
  Sparkles,
  ChevronDown,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

export default function FamilyMapPage() {
  const { familyKnowledge, is_empty } = useFamilyKnowledge();
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const getNodeIcon = (title = '', category = '') => {
    const text = `${title} ${category}`.toLowerCase();
    if (text.includes('health') || text.includes('medic') || text.includes('insurance')) {
      return <Shield className="w-4 h-4 text-rose-400" />;
    }
    if (text.includes('car') || text.includes('vehicle') || text.includes('motor')) {
      return <Car className="w-4 h-4 text-blue-400" />;
    }
    if (text.includes('home') || text.includes('property') || text.includes('tax') || text.includes('house')) {
      return <Home className="w-4 h-4 text-indigo-400" />;
    }
    if (text.includes('electric') || text.includes('power') || text.includes('bill') || text.includes('utility')) {
      return <Zap className="w-4 h-4 text-amber-400" />;
    }
    if (text.includes('edu') || text.includes('school') || text.includes('college')) {
      return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    }
    return <HeartHandshake className="w-4 h-4 text-purple-400" />;
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
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Network className="w-4 h-4" />
              <span>Visual Relationship Graph</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Family Responsibility Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Visual map showing how family members connect to shared assets, insurance policies, and bills.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your family context is waiting to be built</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Upload your first family document to begin mapping family members, assets, and shared responsibilities.
            </p>
          </div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Network className="w-4 h-4" />
            <span>Visual Relationship Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Family Responsibility Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual map showing how family members connect to shared assets, insurance policies, and bills.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedMember('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedMember === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Members ({members.length})
          </button>
          {members.map((m) => (
            <button
              key={m.name}
              onClick={() => setSelectedMember(m.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedMember.toLowerCase() === m.name.toLowerCase()
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {m.name.split(' ')[0]}'s Branch
            </button>
          ))}
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Active Intelligence Graph:</strong> Derived automatically from {familyKnowledge.documents.length} verified documents in your vault.
          <span className="font-mono text-amber-300 mx-1">
            {familyKnowledge.familyName || 'Family'} Core ➔ {members.map(m => m.name.split(' ')[0]).join(', ')} ➔ {familyKnowledge.responsibilities.length} Responsibilities
          </span>.
        </div>
      </div>

      {/* MAP TREE CONTAINER */}
      <div className="relative p-6 sm:p-10 rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden space-y-12">
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* 1. ROOT NODE: FAMILY CORE */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-orange-500/5 border border-amber-500/35 shadow-[0_0_50px_rgba(245,158,11,0.12)] text-center max-w-sm w-full space-y-2 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/15">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Central Family Core
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {familyKnowledge.familyName || 'Family'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {members.length} Members · {familyKnowledge.responsibilities.length} Obligations · {familyKnowledge.entities.length} Entities
              </p>
            </div>
          </div>

          {/* Stem connector */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-amber-500/60 to-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
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
              <div className={`w-full p-4 rounded-xl bg-slate-800/70 border shadow-lg text-center space-y-2 relative ${
                memberResponsibilities.filter(r => r.priority === 'high').length > 0
                  ? 'border-rose-500/40 border-l-4 border-l-rose-500'
                  : memberResponsibilities.length > 0
                  ? 'border-amber-500/25 border-l-4 border-l-amber-500/60'
                  : 'border-slate-700/60'
              }`}>
                <div className="flex justify-center -mt-8">
                  <div className="p-1 rounded-full bg-slate-900 border border-slate-700">
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
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {member.name}
                  </h3>
                  <span className="text-[11px] text-amber-400/90 font-medium block capitalize">
                    {member.roles?.join(' · ') || 'Family Member'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    memberResponsibilities.filter(r => r.priority === 'high').length > 0 ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}></span>
                  <span>{memberResponsibilities.length} Linked Obligations</span>
                </div>
              </div>

                {/* Vertical link connector */}
                <div className="w-0.5 h-6 bg-slate-700"></div>

                {/* RESPONSIBILITY / ASSET CARDS UNDER THIS MEMBER */}
                <div className="w-full space-y-3">
                  {memberResponsibilities.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-center text-xs text-slate-600">
                      No direct obligations linked yet
                    </div>
                  ) : (
                    memberResponsibilities.map((resp) => (
                      <div
                        key={resp.id}
                        onClick={() => setSelectedNode(resp)}
                        className="cursor-pointer rounded-xl p-3 border border-slate-800 hover:border-amber-500/40 bg-slate-900/50 hover:bg-slate-900/80 space-y-2 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:scale-105 transition-transform shrink-0">
                              {getNodeIcon(resp.title, resp.category)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors leading-snug">
                                {resp.title}
                              </h4>
                              <span className="text-[10px] text-slate-500">
                                {resp.category || 'Obligation'}
                              </span>
                            </div>
                          </div>

                          {getUrgencyBadge(resp.priority)}
                        </div>

                        {(resp.due_date || resp.amount) && (
                          <div className="flex items-center gap-2 text-[10px]">
                            {resp.due_date && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-slate-300">
                                <Calendar className="w-3 h-3 text-amber-400" />
                                {resp.due_date}
                              </span>
                            )}
                            {resp.amount && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 font-bold text-amber-300">
                                {resp.amount}
                              </span>
                            )}
                          </div>
                        )}

                        {resp.why_this_matters && (
                          <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
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
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-300">Responsibility Status:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Priority (≤14 days)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Upcoming (≤30 days)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Completed / Paid
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Live Cross-Document Graph • {familyKnowledge.documents.length} Source Documents Connected
          </div>
        </div>
      </div>
    </div>
  );
}
