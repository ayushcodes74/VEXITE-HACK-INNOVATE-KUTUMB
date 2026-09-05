import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  FileText,
  Users,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  CalendarDays,
  Layers,
  ArrowRight,
  Repeat2,
  UserCheck,
  X,
  ArrowLeftRight,
  Leaf,
  BrainCircuit
} from 'lucide-react';

import { useFamilyKnowledge } from '../context/FamilyContext';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

const OLIVE = '#5a7a4a';
const OLIVE_DIM = 'rgba(90,122,74,0.08)';
const OLIVE_BORDER = 'rgba(90,122,74,0.18)';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { familyKnowledge, analyzedDocuments } = useFamilyKnowledge();
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [transferOverrides, setTransferOverrides] = useState({});
  const [transferModal, setTransferModal] = useState({ open: false, item: null });
  const [transferSuccess, setTransferSuccess] = useState({});

  const toggleExpand = (id) => setExpandedCardId(prev => prev === id ? null : id);
  const resolveOwner = (item) => transferOverrides[item.id] || item.person;
  const openTransferModal = (item) => setTransferModal({ open: true, item });
  const confirmTransfer = (newPerson) => {
    const item = transferModal.item;
    if (!item || !newPerson) return;
    setTransferOverrides(prev => ({ ...prev, [item.id]: newPerson }));
    setTransferSuccess(prev => ({ ...prev, [item.id]: newPerson }));
    setTransferModal({ open: false, item: null });
    setTimeout(() => {
      setTransferSuccess(prev => { const n = { ...prev }; delete n[item.id]; return n; });
    }, 4500);
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

  const TransferModal = () => {
    const [selectedPerson, setSelectedPerson] = useState('');
    if (!transferModal.open || !transferModal.item) return null;
    const item = transferModal.item;
    const currentOwner = resolveOwner(item);
    const otherMembers = people.filter(p => p.name.toLowerCase() !== currentOwner.toLowerCase());

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        onClick={e => { if (e.target === e.currentTarget) setTransferModal({ open: false, item: null }); }}
      >
        <div className="animate-modalIn relative w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 64px -16px rgba(0,0,0,0.2)' }}>
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${OLIVE}, #4a6a3a, ${OLIVE})` }} />
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: OLIVE_DIM, border: `1px solid ${OLIVE_BORDER}` }}>
                <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: OLIVE }} />
              </div>
              <span className="font-bold text-sm" style={{ color: '#111111' }}>Transfer Responsibility</span>
            </div>
            <button onClick={() => setTransferModal({ open: false, item: null })} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors focus-ring" style={{ background: '#F0EDE8', color: '#888888' }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="p-3 rounded-xl space-y-1" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: OLIVE }}>Transferring</p>
              <p className="text-sm font-bold leading-snug" style={{ color: '#111111' }}>{item.title}</p>
              <p className="text-xs" style={{ color: '#888888' }}>
                Currently: <span className="font-semibold" style={{ color: '#c08a20' }}>{currentOwner}</span>
              </p>
            </div>
            <p className="text-xs font-semibold" style={{ color: '#333333' }}>Who should take this?</p>
            <div className="space-y-2">
              {otherMembers.length === 0 ? (
                <p className="text-xs italic" style={{ color: '#AAAAAA' }}>No other family members detected.</p>
              ) : otherMembers.map(member => (
                <button
                  key={member.name}
                  onClick={() => setSelectedPerson(member.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left focus-ring ${selectedPerson === member.name ? 'border-[rgba(90,122,74,0.35)] bg-[rgba(90,122,74,0.06)]' : 'bg-white hover:border-[rgba(0,0,0,0.12)]'}`}
                  style={{ borderColor: selectedPerson === member.name ? undefined : 'rgba(0,0,0,0.07)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: '#555555' }}>
                    {member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#111111' }}>{member.name}</p>
                    <p className="text-[10px]" style={{ color: '#888888' }}>{member.roles[0] || 'Family Member'}</p>
                  </div>
                  {selectedPerson === member.name && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: OLIVE }}>
                      <UserCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] leading-relaxed pt-1" style={{ color: '#AAAAAA', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              Another family member can take over when the current owner is unavailable. Local session transfer.
            </p>
          </div>
          <div className="px-5 pb-5 flex gap-3">
            <button onClick={() => setTransferModal({ open: false, item: null })} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[#F0EDE8] focus-ring" style={{ color: '#555555', border: '1px solid rgba(0,0,0,0.08)' }}>
              Cancel
            </button>
            <button
              disabled={!selectedPerson}
              onClick={() => confirmTransfer(selectedPerson)}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:brightness-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed focus-ring"
              style={{ background: `linear-gradient(135deg, #5a7a4a, #4a6a3a)`, color: '#FFFFFF', boxShadow: '0 2px 8px -2px rgba(90,122,74,0.3)' }}
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Empty state ────────────────────────────────────────────── */
  if (isEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-8 animate-fadeIn">
        <div className="space-y-4 max-w-2xl">
          <div className="section-label mx-auto mb-2">
            <Leaf className="w-3 h-3" />
            <span>Family Knowledge</span>
          </div>
          <h1 className="heading-xl">
            Know what matters.<br />
            <span style={{ color: OLIVE }}>Know who handles it.</span>
          </h1>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#666666' }}>
            Upload your first family document — insurance policy, utility bill, loan statement, or property record — and KUTUMB will build your family's shared knowledge map.
          </p>
        </div>

        <button
          onClick={() => navigate('/documents')}
          className="k-btn-primary flex items-center gap-2.5 px-6 py-3.5 rounded-2xl"
        >
          <FileText className="w-4.5 h-4.5" />
          <span>Add First Document</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full">
          {[
            { n: '01', label: 'Upload', sub: 'Family documents' },
            { n: '02', label: 'Understand', sub: 'Gemini extracts context' },
            { n: '03', label: 'Connect', sub: 'Build knowledge model' },
            { n: '04', label: 'Act', sub: 'See responsibilities' },
          ].map(s => (
            <div key={s.n} className="flex flex-col items-center text-center gap-1.5 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <span className="text-[10px] font-black" style={{ color: OLIVE }}>{s.n}</span>
              <span className="text-sm font-bold" style={{ color: '#111111' }}>{s.label}</span>
              <span className="text-[11px] leading-snug" style={{ color: '#888888' }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Main dashboard ─────────────────────────────────────────── */
  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      <TransferModal />

      {/* ── COMPACT HERO ─────────────────────────────────────────────── */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(90,122,74,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold" style={{ color: '#888888' }}>
              Good morning, <span style={{ color: '#333333' }}>{family || 'Sharma Family'}</span>.
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#111111', lineHeight: 1.15 }}>
              Know what matters.<br />
              <span style={{ color: OLIVE }}>Know who handles it.</span>
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#888888' }}>
              KUTUMB connects your family's documents, people and responsibilities into one shared context.
            </p>
          </div>

          <button
            onClick={() => navigate('/ask')}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:brightness-105 active:scale-95 self-start"
            style={{ background: OLIVE_DIM, color: OLIVE, border: `1px solid ${OLIVE_BORDER}` }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask KUTUMB</span>
          </button>
        </div>

        {/* Metrics row — compact, editorial */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { value: String(metrics.totalDocuments).padStart(2, '0'), label: 'Documents', color: '#2980b9' },
            { value: String(people.length).padStart(2, '0'), label: 'Family Members', color: OLIVE },
            { value: String(metrics.activeResponsibilitiesCount || (needsAttention.length + upcoming.length)).padStart(2, '0'), label: 'Active Responsibilities', color: '#c08a20' },
            { value: String(needsAttention.length).padStart(2, '0'), label: 'Needs Attention', color: '#c0392b' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3.5 flex items-baseline gap-3" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.04)' }}>
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              <span className="text-[11px] font-medium leading-tight" style={{ color: '#888888' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN GRID ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN — 2/3 */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. NEEDS ATTENTION — strongest section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c0392b' }} />
                  <span className="label-xs" style={{ color: '#c0392b' }}>Needs Attention</span>
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#111111' }}>What requires action now.</h2>
              </div>
              <span className="text-xs" style={{ color: '#AAAAAA' }}>{needsAttention.length}</span>
            </div>

            {needsAttention.length === 0 ? (
              <div className="p-5 rounded-xl text-center space-y-2" style={{ background: '#FFFFFF', border: '1px dashed rgba(0,0,0,0.08)' }}>
                <CheckCircle2 className="w-5 h-5 mx-auto" style={{ color: '#27ae60' }} />
                <p className="text-sm font-semibold" style={{ color: '#333333' }}>All clear. No urgent items.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {needsAttention.map((item) => (
                  <div key={item.id} className="attention-card p-5 space-y-3 animate-slideUp">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="label-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.06)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.15)' }}>
                            Urgent
                          </span>
                          <span className="label-xs px-2 py-0.5 rounded-full" style={{ color: '#888888', background: '#F0EDE8', border: '1px solid rgba(0,0,0,0.05)' }}>
                            {item.category}
                          </span>
                          {item.amount && (
                            <span className="text-sm font-bold" style={{ color: '#c08a20' }}>{item.amount}</span>
                          )}
                        </div>
                        <h3 className="text-base font-bold leading-snug" style={{ color: '#111111' }}>{item.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: '#888888' }}>
                          <span>
                            <span style={{ color: '#AAAAAA' }}>Who: </span>
                            <strong style={{ color: '#333333' }}>{resolveOwner(item)}</strong>
                            {transferOverrides[item.id] && (
                              <span className="ml-1 text-[10px] font-semibold" style={{ color: '#27ae60' }}>(transferred)</span>
                            )}
                          </span>
                          <span className="flex items-center gap-1" style={{ color: '#c08a20' }}>
                            <Calendar className="w-3.5 h-3.5" />
                            <strong>Due: {item.due_date}</strong>
                          </span>
                        </div>
                        {item.why_this_matters && (
                          <p className="text-xs leading-relaxed" style={{ color: '#666666' }}>
                            {item.why_this_matters.length > 120 ? item.why_this_matters.slice(0, 120) + '…' : item.why_this_matters}
                          </p>
                        )}
                        {transferSuccess[item.id] && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold animate-pulse" style={{ color: '#27ae60' }}>
                            <UserCheck className="w-3.5 h-3.5" />
                            Transferred to {transferSuccess[item.id]}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openTransferModal(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus-ring hover:brightness-105"
                          style={{ background: OLIVE_DIM, color: OLIVE, border: `1px solid ${OLIVE_BORDER}` }}
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Transfer</span>
                        </button>
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors hover:bg-[#F0EDE8] focus-ring"
                          style={{ color: '#888888', border: '1px solid rgba(0,0,0,0.06)' }}
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCardId === item.id ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {expandedCardId === item.id && (
                      <div className="p-3.5 rounded-xl space-y-2 text-xs animate-fadeIn" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)', color: '#555555' }}>
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c08a20' }} />
                          <p className="leading-relaxed">{item.why_this_matters}</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-[10px]" style={{ color: '#AAAAAA', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                          <span>Action: <strong style={{ color: '#888888' }}>{item.action}</strong></span>
                          <span className="font-mono">Source: {item.source_file}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-[10px]" style={{ color: '#AAAAAA', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <span className="font-mono truncate max-w-[200px]">Source: {item.source_file}</span>
                      <span className="font-semibold shrink-0" style={{ color: 'rgba(192,57,43,0.7)' }}>Action Required</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. UPCOMING — date-first compact timeline */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" style={{ color: '#c08a20' }} />
                <h2 className="text-lg font-bold" style={{ color: '#111111' }}>Upcoming</h2>
              </div>
              <span className="text-xs" style={{ color: '#AAAAAA' }}>{upcoming.length} scheduled</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-4 rounded-xl text-xs" style={{ color: '#AAAAAA', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                No upcoming responsibilities.
              </div>
            ) : (
              <div className="space-y-2">
                {upcoming.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-[#F7F4F0]" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                    {/* Date block — visually strong */}
                    <div className="text-center shrink-0 w-14 rounded-lg py-2" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.04)' }}>
                      {(() => {
                        const dateStr = item.due_date || '';
                        const monthMatch = dateStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
                        const dayMatch = dateStr.match(/(\d{1,2})/);
                        return (
                          <>
                            <span className="text-[9px] font-bold block uppercase leading-none" style={{ color: OLIVE }}>{monthMatch ? monthMatch[1].toUpperCase() : 'DUE'}</span>
                            <span className="text-lg font-extrabold block leading-tight" style={{ color: '#111111' }}>{dayMatch ? dayMatch[1] : '•'}</span>
                          </>
                        );
                      })()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold leading-snug" style={{ color: '#111111' }}>{item.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: '#888888' }}>
                        <span>{resolveOwner(item)}</span>
                        {item.amount && (
                          <>
                            <span style={{ color: '#D5D0CA' }}>·</span>
                            <span className="font-semibold" style={{ color: '#c08a20' }}>{item.amount}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openTransferModal(item)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all focus-ring hover:brightness-105"
                        style={{ color: OLIVE, background: 'transparent' }}
                        title="Transfer"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-[10px] font-medium px-2 py-1 rounded-lg transition-colors focus-ring"
                        style={{ color: '#AAAAAA' }}
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCardId === item.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. PREDICTIVE RESPONSIBILITIES — distinct AI treatment */}
          <section className="space-y-4 animate-slideUp">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-0.5">
                <BrainCircuit className="w-4 h-4" style={{ color: OLIVE }} />
                <span className="label-xs" style={{ color: OLIVE }}>AI Prediction</span>
              </div>
              <h2 className="text-lg font-bold" style={{ color: '#111111' }}>Predictive Responsibilities</h2>
              <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>
                KUTUMB learns recurring patterns from your uploaded documents to anticipate what may come next.
              </p>
            </div>

            {recurringPredictions.length === 0 ? (
              <div className="p-5 rounded-xl text-center space-y-2" style={{ background: '#FFFFFF', border: '1px dashed rgba(90,122,74,0.15)' }}>
                <Repeat2 className="w-5 h-5 mx-auto" style={{ color: OLIVE }} />
                <p className="text-sm font-semibold" style={{ color: '#333333' }}>No patterns detected yet.</p>
                <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: '#888888' }}>Upload more documents and KUTUMB will identify recurring responsibilities.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  {recurringPredictions.map((pred, pIdx) => (
                    <div key={pred.id} className="predict-card p-4 space-y-2.5 relative overflow-hidden" style={{ animationDelay: `${pIdx * 60}ms` }}>
                      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full pointer-events-none" style={{ background: 'rgba(90,122,74,0.04)', filter: 'blur(12px)' }} />

                      <div className="flex items-start gap-3 relative">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: OLIVE_DIM, border: `1px solid ${OLIVE_BORDER}` }}>
                          <Repeat2 className="w-3.5 h-3.5" style={{ color: OLIVE }} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`label-xs px-1.5 py-0.5 rounded border ${pred.frequency === 'MONTHLY' ? 'bg-[rgba(41,128,185,0.06)] text-[#2980b9] border-[rgba(41,128,185,0.15)]' : 'bg-[rgba(192,138,32,0.06)] text-[#c08a20] border-[rgba(192,138,32,0.15)]'}`}>
                              {pred.frequencyLabel}
                            </span>
                            <span className="label-xs px-1.5 py-0.5 rounded" style={{ color: '#AAAAAA', background: '#F0EDE8', border: '1px solid rgba(0,0,0,0.04)' }}>
                              {pred.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold leading-snug" style={{ color: '#111111' }}>{pred.title}</h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: '#888888' }}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" style={{ color: OLIVE }} />
                              Expected <strong style={{ color: '#333333' }}>{pred.nextExpectedFormatted}</strong>
                            </span>
                            {pred.estimatedAmountMin !== null && (
                              <span>
                                <span style={{ color: '#AAAAAA' }}>Est. </span>
                                <strong style={{ color: '#c08a20' }}>{pred.amountLabel}</strong>
                              </span>
                            )}
                            <span style={{ color: '#AAAAAA' }}>·</span>
                            <span>{pred.assignedPerson}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 text-[10px] flex items-center gap-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', color: '#AAAAAA' }}>
                        <span>Source: {pred.sourceDocuments[0] || 'family document'}</span>
                        <span style={{ color: '#D5D0CA' }}>·</span>
                        <span className="italic">Estimate — verify when actual bill arrives</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 px-3 py-2 rounded-lg text-[10px]" style={{ color: '#AAAAAA', background: 'rgba(90,122,74,0.03)', border: '1px solid rgba(90,122,74,0.08)' }}>
                  <Info className="w-3 h-3 shrink-0 mt-0.5" style={{ color: OLIVE }} />
                  <span><strong style={{ color: OLIVE }}>Estimates only.</strong> Pattern-based projections from uploaded documents. Verify when the actual bill or renewal notice arrives.</span>
                </div>
              </div>
            )}
          </section>

          {/* 4. TIMELINE */}
          {timeline.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: '#2980b9' }} />
                <h2 className="text-base font-bold" style={{ color: '#111111' }}>Timeline</h2>
              </div>
              <div className="p-4 rounded-xl space-y-3" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                {timeline.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 pb-1" style={{ color: '#c08a20', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span className="w-1 h-1 rounded-full" style={{ background: '#c08a20' }} />
                      {group.title}
                    </div>
                    <div className="space-y-1.5">
                      {group.items.map(item => (
                        <div key={item.id} className="px-3 py-2 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors hover:bg-[#F7F4F0]" style={{ background: '#FAFAF8' }}>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold w-8 text-center" style={{ color: OLIVE }}>{item.monthName || '—'}</span>
                            <span className="text-sm font-extrabold w-6" style={{ color: '#111111' }}>{item.day || '•'}</span>
                            <div>
                              <h4 className="font-bold text-xs" style={{ color: '#111111' }}>{item.title}</h4>
                              <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{item.person}</span>
                            </div>
                          </div>
                          {item.amount && <span className="text-[10px] font-bold shrink-0" style={{ color: '#c08a20' }}>{item.amount}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. ALREADY HANDLED */}
          {alreadyHandled.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#27ae60' }} />
                <h2 className="text-base font-bold" style={{ color: '#111111' }}>Already Handled</h2>
              </div>
              <div className="space-y-2">
                {alreadyHandled.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors hover:bg-[#F7F4F0]" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.12)' }}>
                        <CheckCircle2 className="w-3 h-3" style={{ color: '#27ae60' }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold" style={{ color: '#555555' }}>{item.title}</h4>
                        <span className="text-[11px]" style={{ color: '#AAAAAA' }}>{item.person} · {item.due_date}</span>
                      </div>
                    </div>
                    {item.amount && <span className="text-xs font-bold shrink-0" style={{ color: '#AAAAAA' }}>{item.amount}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN — 1/3 */}
        <div className="space-y-5">
          {/* Family overview */}
          <div className="k-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: OLIVE }} />
                <h3 className="font-bold text-sm" style={{ color: '#111111' }}>
                  {family ? `The ${family.replace(' Family', '')} Family` : 'Family'}
                </h3>
              </div>
              <Link to="/family-map" className="text-xs font-medium flex items-center gap-1 transition-colors focus-ring" style={{ color: OLIVE }}>
                <span>Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {people.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[#F7F4F0]" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar member={{ name: person.name, id: person.name.toLowerCase().split(' ')[0], activeAlerts: person.activeAlerts }} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold leading-tight" style={{ color: '#111111' }}>{person.name}</h4>
                      <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{person.roles[0] || 'Family Member'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold block" style={{ color: '#555555' }}>{person.responsibilitiesCount}</span>
                    <span className="text-[10px]" style={{ color: '#AAAAAA' }}>{person.responsibilitiesCount === 1 ? 'task' : 'tasks'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-2">
            <h4 className="label-xs px-1" style={{ color: '#AAAAAA' }}>Explore</h4>
            {[
              { to: '/documents', icon: FileText, label: 'Documents Vault', sub: `${metrics.totalDocuments} records analyzed`, color: '#2980b9' },
              { to: '/family-map', icon: Layers, label: 'Family Map', sub: `${people.length} members connected`, color: OLIVE },
              { to: '/ask', icon: Sparkles, label: 'Ask KUTUMB', sub: 'Natural language queries', color: '#c08a20' },
            ].map(card => {
              const Icon = card.icon;
              return (
                <Link key={card.to} to={card.to} className="group flex items-center justify-between p-3.5 rounded-xl transition-all hover:bg-[#F7F4F0]" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ background: `${card.color}10`, border: `1px solid ${card.color}25` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold group-hover:text-[#111111] transition-colors" style={{ color: '#333333' }}>{card.label}</h5>
                      <p className="text-[10px]" style={{ color: '#AAAAAA' }}>{card.sub}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-[#555555] transition-colors" style={{ color: '#D5D0CA' }} />
                </Link>
              );
            })}
          </div>

          {/* AI Pipeline */}
          <div className="k-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#c08a20' }} />
              <span className="label-xs" style={{ color: '#c08a20' }}>How KUTUMB thinks</span>
            </div>
            <h3 className="text-sm font-bold leading-snug" style={{ color: '#111111' }}>Gemini understands.<br />KUTUMB connects.</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>
              Gemini handles multimodal document understanding. KUTUMB combines that into a persistent family knowledge model.
            </p>

            <div className="space-y-1 text-[10px] font-semibold">
              {['Document', 'Gemini Analysis', 'People + Dates + Entities', 'Knowledge Model', 'Responsibilities', 'Predictions'].map((node, i) => (
                <div key={node}>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: i === 1 ? 'rgba(192,138,32,0.06)' : i === 3 ? OLIVE_DIM : '#FAFAF8', border: `1px solid ${i === 1 ? 'rgba(192,138,32,0.10)' : i === 3 ? OLIVE_BORDER : 'rgba(0,0,0,0.04)'}` }}>
                    <span style={{ color: i === 1 ? '#c08a20' : i === 3 ? OLIVE : '#AAAAAA' }}>{node}</span>
                  </div>
                  {i < 5 && <div className="ml-4 w-px h-1.5" style={{ background: 'rgba(0,0,0,0.05)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="px-4 py-3 rounded-xl text-[10px] leading-relaxed" style={{ color: '#AAAAAA', background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>
            KUTUMB is an organizational intelligence tool. Verify important deadlines directly with respective institutions.
          </div>
        </div>
      </div>
    </div>
  );
}
