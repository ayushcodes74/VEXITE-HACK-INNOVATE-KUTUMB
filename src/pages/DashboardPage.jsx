import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  CreditCard, 
  FileText, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  FolderOpen,
  Info,
  CalendarDays,
  Shield,
  Layers,
  ArrowRight,
  Repeat2,
  Zap,
  UserCheck,
  X,
  ArrowLeftRight
} from 'lucide-react';

import { useFamilyKnowledge } from '../context/FamilyContext';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { familyKnowledge, analyzedDocuments } = useFamilyKnowledge();
  const [expandedCardId, setExpandedCardId] = useState(null);
  // Milestone 4B: local override map — { [responsibilityId]: newPersonName }
  const [transferOverrides, setTransferOverrides] = useState({});
  // { open: bool, item: responsibility object }
  const [transferModal, setTransferModal] = useState({ open: false, item: null });
  // { [responsibilityId]: newPersonName } — shows success flash after transfer
  const [transferSuccess, setTransferSuccess] = useState({});

  const toggleExpand = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  /** Returns the effective person for a responsibility (override or original) */
  const resolveOwner = (item) => transferOverrides[item.id] || item.person;

  /** Open the transfer modal for a given responsibility card */
  const openTransferModal = (item) => {
    setTransferModal({ open: true, item });
  };

  /** Apply the chosen transfer — update override map and show success flash */
  const confirmTransfer = (newPerson) => {
    const item = transferModal.item;
    if (!item || !newPerson) return;
    setTransferOverrides(prev => ({ ...prev, [item.id]: newPerson }));
    setTransferSuccess(prev => ({ ...prev, [item.id]: newPerson }));
    setTransferModal({ open: false, item: null });
    // Auto-clear the success flash after 4 s
    setTimeout(() => {
      setTransferSuccess(prev => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 4000);
  };

  const {
    isEmpty,
    family,
    people,
    needsAttention,
    upcoming,
    alreadyHandled,
    timeline,
    metrics,
    recurringPredictions = []
  } = familyKnowledge;


  /* ── Milestone 4B: Transfer Modal ──────────────────────────────────────── */
  const TransferModal = () => {
    const [selectedPerson, setSelectedPerson] = useState('');
    if (!transferModal.open || !transferModal.item) return null;
    const item = transferModal.item;
    const currentOwner = resolveOwner(item);
    const otherMembers = people.filter(
      p => p.name.toLowerCase() !== currentOwner.toLowerCase()
    );

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) setTransferModal({ open: false, item: null }); }}
      >
        <div className="animate-modalIn relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/70 overflow-hidden">
          {/* Accent top bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="font-bold text-white text-sm">Transfer Responsibility</span>
            </div>
            <button
              onClick={() => setTransferModal({ open: false, item: null })}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors focus-ring"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {/* Responsibility being transferred */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-1">
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Transferring</p>
              <p className="text-sm font-bold text-white leading-snug">{item.title}</p>
              <p className="text-xs text-slate-400">
                Currently assigned to{' '}
                <span className="text-amber-300 font-semibold">{currentOwner}</span>
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-200">Who should take this responsibility?</p>

            {/* Member selector */}
            <div className="space-y-2">
              {otherMembers.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No other family members detected from documents.</p>
              ) : (
                otherMembers.map((member) => (
                  <button
                    key={member.name}
                    onClick={() => setSelectedPerson(member.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left focus-ring ${
                      selectedPerson === member.name
                        ? 'bg-amber-500/12 border-amber-500/50 shadow-[0_0_14px_rgba(245,158,11,0.12)]'
                        : 'bg-slate-800/30 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                      {member.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {member.roles.slice(0,1).join('') || 'Family Member'}
                      </p>
                    </div>
                    {selectedPerson === member.name && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                        <UserCheck className="w-3 h-3 text-slate-950" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Explanation */}
            <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800/60 pt-3">
              Another family member can take over when the current owner is unavailable. This is a local session transfer.
            </p>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={() => setTransferModal({ open: false, item: null })}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              disabled={!selectedPerson}
              onClick={() => confirmTransfer(selectedPerson)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all focus-ring"
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Milestone 4B: Transfer Modal (portal-like, rendered at top level) */}
      <TransferModal />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Document Family Intelligence</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Namaste, {family.name} 👋
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              <span className="text-amber-300 font-medium">"Because family knowledge shouldn't live in one person's head."</span>
              <span className="block text-xs sm:text-sm text-slate-400 mt-1">
                Unified family intelligence synthesized across your uploaded paperwork, policies, loans, and bills.
              </span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Upload / Analyze Documents</span>
            </Link>

            <Link
              to="/ask"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask KUTUMB</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Context Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Documents Analyzed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-white">{metrics.relevantDocumentsCount}</span>
              <span className="text-[11px] text-slate-400">Verified Files</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">People Connected</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-amber-300">{metrics.connectedPeopleCount}</span>
              <span className="text-[11px] text-amber-300/80">Family Members</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Needs Attention</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-rose-400">{metrics.urgentCount}</span>
              <span className="text-[11px] text-rose-400/80">High Priority</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Total Obligation</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-100">{metrics.totalObligationFormatted}</span>
              <span className="text-[11px] text-slate-400">Upcoming Dues</span>
            </div>
          </div>
        </div>
      </div>

      {/* EMPTY STATE (When 0 relevant documents are analyzed) */}
      {isEmpty ? (
        <div className="p-12 sm:p-16 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <FolderOpen className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">
              Your family context is waiting to be built.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload a family document (health policy, electricity bill, loan statement, or tax receipt) to start building your Family Knowledge & Responsibility Map.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/documents')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Documents Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE DASHBOARD (DERIVED STRICTLY FROM REAL ANALYZED DOCUMENTS) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left 2 Columns: Needs Attention + Upcoming + Timeline + Handled */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. NEEDS ATTENTION (HIGH PRIORITY) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Needs Attention
                      <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                        {needsAttention.length} Urgent Action{needsAttention.length === 1 ? '' : 's'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Deadlines requiring prompt review or payment</p>
                  </div>
                </div>
              </div>

              {needsAttention.length === 0 ? (
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No high-priority alerts pending right now. All critical items are up-to-date.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {needsAttention.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl p-5 border-l-4 border-l-rose-500 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="high">Priority: High</Badge>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {item.category}
                            </span>
                            {item.amount && (
                              <span className="text-xs font-bold text-amber-300">
                                {item.amount}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white">
                            {item.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                            <div>
                              <span className="text-slate-400 mr-1">Responsible:</span>
                              <strong className="text-slate-100">{resolveOwner(item)}</strong>
                              {transferOverrides[item.id] && (
                                <span className="ml-1.5 text-[10px] text-emerald-400 font-semibold">(transferred)</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-amber-300">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Due: <strong>{item.due_date}</strong></span>
                            </div>
                          </div>
                          {/* Milestone 4B: success flash */}
                          {transferSuccess[item.id] && (
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium animate-pulse">
                              <UserCheck className="w-3 h-3" />
                              Responsibility transferred to {transferSuccess[item.id]}
                            </div>
                          )}
                        </div>

                        {/* Expandable context + Take Responsibility buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openTransferModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            <span>Transfer</span>
                          </button>
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <span>Why this matters</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCardId === item.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Expandable "Why This Matters" Context Section */}
                      {expandedCardId === item.id && (
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300 animate-fadeIn">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              {item.why_this_matters}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Detected Action: <strong className="text-slate-300">{item.action}</strong></span>
                            <span className="font-mono text-slate-300 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-500" />
                              Source: {item.source_file}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Traceability Footer */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono">Source: {item.source_file}</span>
                        <span className="text-rose-400/90 font-medium">Action Required</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. UPCOMING RESPONSIBILITIES */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Upcoming Responsibilities</h2>
                    <p className="text-xs text-slate-400">Scheduled dues and renewals across your family map</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{upcoming.length} scheduled</span>
              </div>

              {upcoming.length === 0 ? (
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                  No upcoming responsibilities recorded.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcoming.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="medium">{item.category}</Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {item.due_date}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-2">
                          {item.action}
                        </p>
                      </div>

                      {/* Expandable Why this matters */}
                      {expandedCardId === item.id && (
                        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                          <p className="leading-snug">{item.why_this_matters}</p>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Responsible</span>
                          <span className="font-semibold text-slate-200">{resolveOwner(item)}</span>
                          {transferOverrides[item.id] && (
                            <span className="text-[10px] text-emerald-400 font-semibold block">(transferred)</span>
                          )}
                        </div>
                        {item.amount && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Amount</span>
                            <span className="font-bold text-amber-300">{item.amount}</span>
                          </div>
                        )}
                      </div>

                      {/* Milestone 4B: success flash for upcoming card */}
                      {transferSuccess[item.id] && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
                          <UserCheck className="w-3 h-3 shrink-0" />
                          Responsibility transferred to {transferSuccess[item.id]}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[120px] font-mono">
                          Source: {item.source_file}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openTransferModal(item)}
                            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            Transfer
                          </button>
                          <span className="text-slate-600">·</span>
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="text-amber-400 hover:underline"
                          >
                            {expandedCardId === item.id ? 'Hide context' : 'Why this matters'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* MILESTONE 4A — PREDICTIVE RESPONSIBILITIES */}
            <section className="space-y-4 animate-slideUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Repeat2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Predictive Responsibilities
                      <span className="px-2 py-0.5 text-[9px] rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 font-bold uppercase tracking-widest">
                        AI Estimate
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pattern-based projections from your uploaded documents.
                    </p>
                  </div>
                </div>
              </div>

              {recurringPredictions.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 border-dashed text-center space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 mx-auto flex items-center justify-center text-violet-400">
                    <Repeat2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No recurring patterns detected yet.</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Upload more family documents and KUTUMB will identify recurring responsibilities.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recurringPredictions.map((pred, pIdx) => (
                      <div
                        key={pred.id}
                        className="relative rounded-2xl p-4 bg-slate-900/80 border border-violet-500/15 hover:border-violet-500/35 transition-all space-y-3 overflow-hidden group"
                        style={{ animationDelay: `${pIdx * 60}ms` }}
                      >
                        {/* Corner glow */}
                        <div className="absolute -right-6 -top-6 w-20 h-20 bg-violet-500/8 rounded-full blur-xl pointer-events-none" />

                        {/* Header row */}
                        <div className="flex items-start gap-2 relative">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/12 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                            <Repeat2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                pred.frequency === 'MONTHLY'
                                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                                  : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                              }`}>
                                {pred.frequencyLabel}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 border border-slate-700/80">
                                {pred.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white leading-snug">
                              {pred.title}
                            </h3>
                          </div>
                        </div>

                        {/* Key info grid */}
                        <div className="grid grid-cols-2 gap-2 relative">
                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Expected around</span>
                            <span className="text-xs font-bold text-violet-300 leading-tight block">
                              {pred.nextExpectedFormatted}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Estimated</span>
                            {pred.estimatedAmountMin !== null ? (
                              <span className="text-xs font-bold text-amber-300 leading-tight block">
                                {pred.amountLabel}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 italic">See prior docs</span>
                            )}
                          </div>
                        </div>

                        {/* Person + confidence row */}
                        <div className="flex items-center justify-between text-xs relative">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Assigned to</span>
                            <span className="font-semibold text-slate-200 text-xs">{pred.assignedPerson}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            pred.confidence === 'High'   ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                            pred.confidence === 'Medium' ? 'bg-amber-500/10   text-amber-400   border-amber-500/25'   :
                                                           'bg-slate-800      text-slate-400   border-slate-700'
                          }`}>
                            {pred.confidence} confidence
                          </span>
                        </div>

                        {/* Source */}
                        <div className="pt-2.5 border-t border-slate-800/50 relative">
                          <p className="text-[9px] text-slate-500 leading-relaxed">
                            <span className="text-violet-400 font-semibold">Source: </span>
                            {pred.sourceDocuments[0] || 'family document'}
                            <span className="mx-1">·</span>
                            <span className="italic">Estimated, not confirmed</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer disclaimer */}
                  <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/12 text-[10px] text-slate-500">
                    <Info className="w-3 h-3 text-violet-400/70 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-violet-300/80">Estimates only.</strong> Pattern-based projections from uploaded documents. Verify when the actual bill or renewal notice arrives.
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* 3. CHRONOLOGICAL FAMILY TIMELINE */}
            {timeline.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Family Responsibility Timeline</h2>
                      <p className="text-xs text-slate-400">Chronological schedule synthesized from your family documents</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  {timeline.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 pb-1 border-b border-slate-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>{group.title}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-center p-1.5 rounded-lg bg-slate-800/80 min-w-11">
                                <span className="text-[10px] font-bold text-amber-400 block uppercase leading-none">
                                  {item.monthName || 'DUE'}
                                </span>
                                <span className="text-sm font-black text-white block leading-tight">
                                  {item.day || '•'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-xs">{item.title}</h4>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                  <span>{item.person}</span>
                                  {item.amount && <span>• <strong className="text-amber-300 font-semibold">{item.amount}</strong></span>}
                                </div>
                              </div>
                            </div>

                            <Badge variant={item.priority === 'HIGH' ? 'high' : 'medium'}>
                              {item.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. ALREADY HANDLED (COMPLETED RECEIPTS) */}
            {alreadyHandled.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Already Handled</h2>
                      <p className="text-xs text-slate-400">Verified and completed obligations confirmed from payment receipts</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">All verified</span>
                </div>

                <div className="space-y-2.5">
                  {alreadyHandled.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{item.person}</span>
                            <span>•</span>
                            <span className="text-emerald-400/90">{item.due_date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {item.amount && (
                          <span className="text-xs font-bold text-slate-300 block">{item.amount}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          Source: {item.source_file}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Dynamic Family Overview & Connected Members */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-slate-100 text-sm">Family Overview</h3>
                </div>
                <Link 
                  to="/family-map" 
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <span>Family Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregated from your verified documents. Eliminates single-person bottleneck by mapping who holds each family policy and bill.
              </p>

              {/* Dynamically detected family members */}
              <div className="space-y-3">
                {people.map((person, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MemberAvatar
                        member={{
                          name: person.name,
                          id: person.name.toLowerCase().includes('rajesh') ? 'rajesh' : 
                              person.name.toLowerCase().includes('sunita') ? 'sunita' : 
                              person.name.toLowerCase().includes('aarav') ? 'aarav' : 'ananya',
                          activeAlerts: person.activeAlerts
                        }}
                        size="md"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {person.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 leading-tight block">
                          {person.roles.slice(0, 2).join(' • ') || 'Family Member'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-200 block">
                        {person.responsibilitiesCount} task{person.responsibilitiesCount === 1 ? '' : 's'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {person.documentCount} document{person.documentCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Explore KUTUMB
              </h4>

              <Link
                to="/documents"
                className="group block p-4 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/40 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-200 group-hover:text-white">Documents Vault</h5>
                      <p className="text-[11px] text-slate-400">
                        {metrics.totalDocuments} total documents tracked
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </Link>

              <Link
                to="/family-map"
                className="group block p-4 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/40 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-200 group-hover:text-white">Family Map Visualizer</h5>
                      <p className="text-[11px] text-slate-400">{people.length} members connected to assets</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </Link>
            </div>

            {/* Trust & Safety Notice */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <span className="font-semibold text-slate-300 block">Trust & Organization Notice:</span>
              <p>
                KUTUMB is an organizational intelligence tool based purely on your uploaded paperwork. Please verify important deadlines directly with respective financial and utility institutions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
