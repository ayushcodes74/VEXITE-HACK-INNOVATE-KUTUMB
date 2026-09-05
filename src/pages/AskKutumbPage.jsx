import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import Badge from '../components/Badge';

export default function AskKutumbPage() {
  const { familyKnowledge, is_empty } = useFamilyKnowledge();

  const welcomeMessage = useMemo(() => {
    if (is_empty || familyKnowledge.people.length === 0) {
      return {
        id: 'welcome',
        sender: 'kutumb',
        text: `Namaste! I am KUTUMB, your Family Intelligence Assistant. 

Your family vault currently has no analyzed documents. Upload bills, policies, or receipts in Documents Vault to begin indexing family responsibilities.`,
        highlights: null,
        recommendation: "Go to Documents Vault to upload or analyze demo documents.",
        timestamp: 'Just now'
      };
    }

    const memberNames = familyKnowledge.people.map((p) => p.name.split(' ')[0]).join(', ');
    return {
      id: 'welcome',
      sender: 'kutumb',
      text: `Namaste! I am KUTUMB, your ${familyKnowledge.familyName || 'Family'} Intelligence Assistant. 

I have indexed your family knowledge map:
• ${familyKnowledge.people.length} Family Members (${memberNames})
• ${familyKnowledge.documents.length} Verified Documents & Records
• ${familyKnowledge.responsibilities.length} Active Obligations & Deadlines

Click any preset question below or ask me about policies, ownership, and dues!`,
      highlights: null,
      recommendation: null,
      timestamp: 'Just now'
    };
  }, [familyKnowledge, is_empty]);

  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Sync welcome message if familyKnowledge changes and only 1 message exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [welcomeMessage];
      }
      return prev;
    });
  }, [welcomeMessage]);

  const presetQuestions = [
    { id: 'preset-1', label: 'What needs attention this month?' },
    { id: 'preset-2', label: 'Papa ki responsibilities kya hain?' },
    { id: 'preset-3', label: 'Mummy ke naam pe kya hai?' },
    { id: 'preset-4', label: 'What is most urgent?' },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (query) => {
    const lower = query.toLowerCase();
    const responsibilities = familyKnowledge.responsibilities || [];

    if (is_empty || responsibilities.length === 0) {
      return {
        answer: "No documents have been analyzed in your family vault yet. Once you analyze documents like insurance policies or utility bills, I can answer questions about deadlines and owners.",
        highlights: [],
        recommendation: "Head over to the Documents Vault to analyze your records."
      };
    }

    // 1. Most urgent
    if (lower.includes('urgent') || lower.includes('priority')) {
      const urgentItems = responsibilities.filter((r) => r.priority === 'high');
      const itemsToDisplay = urgentItems.length > 0 ? urgentItems : responsibilities.slice(0, 2);

      return {
        answer: `Found ${itemsToDisplay.length} high priority obligation(s) requiring immediate attention. Deadlines are calculated from current anchor date (5 Sep 2026).`,
        highlights: itemsToDisplay.map((r) => ({
          title: r.title,
          person: r.assigned_to || 'Family Shared',
          date: r.due_date || 'Urgent',
          amount: r.amount || 'Variable',
          badge: r.priority === 'high' ? 'High Attention' : 'Scheduled',
          color: r.priority === 'high' ? 'rose' : 'amber'
        })),
        recommendation: itemsToDisplay[0]?.why_this_matters || "Pay before the due date to avoid service disruption or penalty fees."
      };
    }

    // 2. Papa / Father / Rajesh
    if (lower.includes('papa') || lower.includes('rajesh') || lower.includes('father')) {
      const fatherItems = responsibilities.filter((r) => {
        const assigned = (r.assigned_to || '').toLowerCase();
        const shared = (r.shared_with || []).join(' ').toLowerCase();
        return assigned.includes('rajesh') || shared.includes('rajesh') || (r.description || '').toLowerCase().includes('rajesh');
      });

      return {
        answer: `Rajesh Sharma (Papa) is directly linked to ${fatherItems.length} key family responsibilities across your documents:`,
        highlights: fatherItems.map((r) => ({
          title: r.title,
          person: r.assigned_to || 'Rajesh Sharma',
          date: r.due_date || 'Active',
          amount: r.amount || 'N/A',
          badge: r.priority === 'high' ? 'Due Soon' : 'Active',
          color: r.priority === 'high' ? 'rose' : 'amber'
        })),
        recommendation: "Rajesh is the primary policyholder for family health and power utilities."
      };
    }

    // 3. Mummy / Sunita / Mother
    if (lower.includes('mummy') || lower.includes('sunita') || lower.includes('mother')) {
      const motherItems = responsibilities.filter((r) => {
        const assigned = (r.assigned_to || '').toLowerCase();
        const shared = (r.shared_with || []).join(' ').toLowerCase();
        return assigned.includes('sunita') || shared.includes('sunita') || (r.description || '').toLowerCase().includes('sunita');
      });

      return {
        answer: `Sunita Sharma (Mummy) is associated with ${motherItems.length} family assets and responsibilities:`,
        highlights: motherItems.map((r) => ({
          title: r.title,
          person: r.assigned_to || 'Sunita Sharma',
          date: r.due_date || 'Active',
          amount: r.amount || 'N/A',
          badge: 'Joint / Primary',
          color: 'indigo'
        })),
        recommendation: "Sunita is listed as a co-borrower / insured member across household accounts."
      };
    }

    // 4. This month / September / dues
    if (lower.includes('month') || lower.includes('september') || lower.includes('due') || lower.includes('bill')) {
      const sepItems = responsibilities.filter((r) => {
        const d = (r.due_date || '').toLowerCase();
        return d.includes('sep') || d.includes('09-') || r.priority === 'high';
      });
      const display = sepItems.length > 0 ? sepItems : responsibilities.slice(0, 3);

      return {
        answer: `Here are the family dues and deadlines scheduled for September 2026:`,
        highlights: display.map((r) => ({
          title: r.title,
          person: r.assigned_to || 'Family',
          date: r.due_date || 'Sep 2026',
          amount: r.amount || 'N/A',
          badge: r.priority === 'high' ? 'Urgent' : 'Upcoming',
          color: r.priority === 'high' ? 'rose' : 'amber'
        })),
        recommendation: "Ensure health insurance renewal is completed prior to the 18 Sep expiry date."
      };
    }

    // Default search across responsibilities
    const matched = responsibilities.filter((r) => 
      r.title.toLowerCase().includes(lower) || 
      (r.description || '').toLowerCase().includes(lower) ||
      (r.category || '').toLowerCase().includes(lower)
    );

    const items = matched.length > 0 ? matched : responsibilities.slice(0, 2);

    return {
      answer: `Searched family vault for "${query}". Found ${items.length} relevant obligation(s):`,
      highlights: items.map((r) => ({
        title: r.title,
        person: r.assigned_to || 'Family Member',
        date: r.due_date || 'Scheduled',
        amount: r.amount || 'N/A',
        badge: r.priority,
        color: r.priority === 'high' ? 'rose' : 'indigo'
      })),
      recommendation: items[0]?.why_this_matters || "Try clicking any of the preset questions above for instant insights."
    };
  };

  const handleSelectPreset = (presetId, label) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const res = generateAnswer(label);
      setMessages((prev) => [
        ...prev,
        {
          id: `kutumb-${Date.now()}`,
          sender: 'kutumb',
          text: res.answer,
          highlights: res.highlights,
          recommendation: res.recommendation,
          timestamp: 'Just now'
        }
      ]);
    }, 400);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const res = generateAnswer(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `kutumb-${Date.now()}`,
          sender: 'kutumb',
          text: res.answer,
          highlights: res.highlights,
          recommendation: res.recommendation,
          timestamp: 'Just now'
        }
      ]);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Ask KUTUMB</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Static Demo Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Conversational intelligence for Sharma Family policies, dues, and responsibilities.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Question Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          Quick Questions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectPreset(q.id, q.label)}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all text-left focus-ring cursor-pointer"
            >
              <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 leading-snug">{q.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 p-4 sm:p-5" style={{ borderTop: '2px solid rgba(245,158,11,0.15)' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'kutumb' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {/* Rich response cards for KUTUMB answers */}
              {msg.highlights && msg.highlights.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  {msg.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs animate-fadeIn"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white text-xs leading-snug flex-1">{item.title}</span>
                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.color === 'rose'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.color === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                        <span className="text-slate-400">{item.person}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.date}
                        </span>
                        {item.amount && item.amount !== 'N/A' && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="font-bold text-amber-300">{item.amount}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendation Callout */}
              {msg.recommendation && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="leading-snug">{msg.recommendation}</span>
                </div>
              )}

              <div className={`text-[10px] pt-1 text-right ${
                msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about policies, dues, owners… (e.g. 'What is due next month?')"
          className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:hover:brightness-100 disabled:cursor-not-allowed transition-all flex items-center gap-2 focus-ring"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
