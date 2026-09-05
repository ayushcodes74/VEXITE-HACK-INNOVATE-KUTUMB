import React, { useState } from 'react';
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
  ArrowDown,
  Check
} from 'lucide-react';
import { familyMapNodes, familyInfo } from '../data/mockData';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

export default function FamilyMapPage() {
  const [filterMember, setFilterMember] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const { root, members } = familyMapNodes;

  const getNodeIcon = (id) => {
    switch (id) {
      case 'node-health':
      case 'node-aarav-health':
      case 'node-ananya-health':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'node-car':
        return <Car className="w-4 h-4 text-blue-400" />;
      case 'node-homeloan':
      case 'node-homeloan-s':
        return <Home className="w-4 h-4 text-indigo-400" />;
      case 'node-electricity':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'node-aarav-edu':
      case 'node-ananya-school':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-purple-400" />;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'High':
        return <Badge variant="high">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="medium">Upcoming</Badge>;
      default:
        return <Badge variant="success">Active</Badge>;
    }
  };

  const filteredMembers = filterMember === 'all'
    ? members
    : members.filter((m) => m.id === filterMember);

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
            onClick={() => setFilterMember('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterMember === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Whole Family Tree
          </button>
          <button
            onClick={() => setFilterMember('m-rajesh')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterMember === 'm-rajesh'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Papa's Branch
          </button>
          <button
            onClick={() => setFilterMember('m-sunita')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterMember === 'm-sunita'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Mummy's Branch
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Foundation Visualizer:</strong> This map highlights the hierarchy:
          <span className="font-mono text-amber-300 mx-1">Sharma Family ➔ Rajesh & Sunita ➔ Key Assets (Health, Car, Home Loan, Electricity)</span>.
          In the next phase, Gemini graph intelligence will auto-synthesize connection weights and risk bottlenecks.
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

        {/* 1. ROOT NODE: SHARMA FAMILY */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] text-center max-w-sm w-full space-y-2 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-300 shadow-md">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Central Family Core
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {root.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {root.membersCount} Members • {root.assetsTracked} Mapped Obligations
              </p>
            </div>
          </div>

          {/* Stem connector */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-amber-500/60 to-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
        </div>

        {/* 2. FAMILY MEMBERS LAYER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex flex-col items-center space-y-6">
              
              {/* Member Card */}
              <div className="w-full p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-lg text-center space-y-2 relative">
                <div className="flex justify-center -mt-8">
                  <div className="p-1 rounded-full bg-slate-900 border border-slate-700">
                    <MemberAvatar
                      member={{
                        name: member.name,
                        id: member.id.replace('m-', ''),
                        activeAlerts: member.id === 'm-rajesh' ? 1 : 0
                      }}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {member.name}
                  </h3>
                  <span className="text-[11px] text-amber-400/90 font-medium block">
                    {member.role}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{member.responsibilities.length} Linked Nodes</span>
                </div>
              </div>

              {/* Vertical link connector */}
              <div className="w-0.5 h-6 bg-slate-700"></div>

              {/* RESPONSIBILITY / ASSET CARDS UNDER THIS MEMBER */}
              <div className="w-full space-y-3">
                {member.responsibilities.map((resp) => (
                  <div
                    key={resp.id}
                    onClick={() => setSelectedNode(resp)}
                    className="cursor-pointer glass-card rounded-xl p-3.5 border border-slate-800 hover:border-amber-500/50 space-y-2 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/80 group-hover:scale-110 transition-transform">
                          {getNodeIcon(resp.id)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                            {resp.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {resp.tag}
                          </span>
                        </div>
                      </div>

                      {getUrgencyBadge(resp.urgency)}
                    </div>

                    <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 leading-tight">
                      {resp.detail}
                    </p>

                    {resp.sharedWith && resp.sharedWith.length > 0 && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="text-slate-400">Shared with:</span>
                        <span className="capitalize font-medium text-slate-300">
                          {resp.sharedWith.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Legend */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-300">Responsibility Status:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Attention (Health Renewal)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Scheduled Due (EMI & Power)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Active & Up-to-date
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Visual mapping placeholder • Ready for Graph Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
