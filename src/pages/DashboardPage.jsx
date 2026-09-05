import React from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { familyInfo, dashboardData } from '../data/mockData';
import Badge from '../components/Badge';
import MemberAvatar from '../components/MemberAvatar';

export default function DashboardPage() {
  const { needsAttention, upcoming, alreadyHandled } = dashboardData;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero / Greeting Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Family Hub</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {familyInfo.greeting}
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              <span className="text-amber-300 font-medium">"{familyInfo.tagline}"</span>
              <span className="block text-xs sm:text-sm text-slate-400 mt-1">
                All family documents, insurance renewals, and responsibilities unified in one shared map.
              </span>
            </p>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Ask KUTUMB</span>
            </Link>

            <Link
              to="/documents"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-medium transition-all hover:border-slate-600"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>

        {/* Quick Family Metric Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Needs Attention</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-rose-400">{needsAttention.length}</span>
              <span className="text-[11px] text-rose-400/80 font-medium">Urgent Item</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Upcoming Dues</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-amber-300">{upcoming.length}</span>
              <span className="text-[11px] text-amber-300/80 font-medium">In September</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Total Obligation</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-100">{familyInfo.totalMonthlyObligations}</span>
              <span className="text-[11px] text-slate-400">This Month</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-xs text-slate-400">Protected Family</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-emerald-400">{familyInfo.healthCoverTotal}</span>
              <span className="text-[11px] text-emerald-400/80">Cover Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Action Lists + Family Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Priority Sections */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. NEEDS ATTENTION SECTION */}
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
                      {needsAttention.length} Action Required
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Items requiring immediate confirmation or payment</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {needsAttention.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-5 border-l-4 border-l-rose-500 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="high">Priority: {item.priority}</Badge>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {item.daysLeft} days remaining
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Responsible:</span>
                          <span className="font-semibold text-slate-200">{item.owner}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Due: <strong className="text-white">{item.dueDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>Premium: <strong className="text-amber-300">{item.amount}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                      <Link
                        to="/documents"
                        className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <span>{item.actionText}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.policyNumber}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. UPCOMING SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Upcoming Responsibilities</h2>
                  <p className="text-xs text-slate-400">Bills and loan installments scheduled this month</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{upcoming.length} scheduled</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcoming.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="medium">{item.category}</Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.dueDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.notes}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Responsible</span>
                      <span className="font-semibold text-slate-200">{item.owner}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[11px] block">Amount</span>
                      <span className="font-bold text-slate-100">{item.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. ALREADY HANDLED SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Already Handled</h2>
                  <p className="text-xs text-slate-400">Verified and completed tasks recorded for Sharma Family</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium">All cleared</span>
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
                        <span>{item.owner}</span>
                        <span>•</span>
                        <span className="text-emerald-400/90">{item.handledDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-300 block">{item.amount}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.receiptNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 1 Column: Family Overview & Quick Navigation */}
        <div className="space-y-6">
          {/* Family Members Overview Card */}
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
                <span>View Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Responsibilities are distributed across the family to ensure continuity and eliminate single points of failure.
            </p>

            <div className="space-y-3">
              {familyInfo.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <MemberAvatar member={member} size="md" showName showRole />

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-200 block">
                      {member.responsibilitiesCount} {member.responsibilitiesCount === 1 ? 'item' : 'items'}
                    </span>
                    {member.activeAlerts > 0 ? (
                      <span className="text-[10px] text-rose-400 font-bold">1 Action</span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-medium">Clear</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Explore KUTUMB
            </h4>

            {/* Documents shortcut */}
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
                    <p className="text-[11px] text-slate-400">6 synthetic family files & statements</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </Link>

            {/* Family Map shortcut */}
            <Link
              to="/family-map"
              className="group block p-4 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/40 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200 group-hover:text-white">Family Map Visualizer</h5>
                    <p className="text-[11px] text-slate-400">Tree mapping members to assets</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </Link>

            {/* Ask KUTUMB shortcut */}
            <Link
              to="/ask"
              className="group block p-4 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/40 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200 group-hover:text-white">Ask KUTUMB Assistant</h5>
                    <p className="text-[11px] text-slate-400">Natural language family queries</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
