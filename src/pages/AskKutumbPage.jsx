import React, { useState, useRef, useEffect } from 'react';
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
import { askKutumbPresetResponses, familyInfo } from '../data/mockData';
import Badge from '../components/Badge';

export default function AskKutumbPage() {
  const initialMessages = [
    {
      id: 'welcome',
      sender: 'kutumb',
      text: `Namaste! I am KUTUMB, your Sharma Family Intelligence Assistant. 

I have indexed your family knowledge map:
• 4 Family Members (Rajesh, Sunita, Aarav, Ananya)
• 6 Verified Documents & Policies
• September 2026 Obligations & Deadlines

Click any preset question below or ask me about policies, ownership, and dues!`,
      highlights: null,
      recommendation: null,
      timestamp: 'Just now'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

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

  const handleSelectPreset = (presetId, label) => {
    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Find predefined response from mockData
    const found = askKutumbPresetResponses.find((p) => p.id === presetId);

    setTimeout(() => {
      setIsTyping(false);
      if (found) {
        setMessages((prev) => [
          ...prev,
          {
            id: `kutumb-${Date.now()}`,
            sender: 'kutumb',
            text: found.answer,
            highlights: found.highlights,
            recommendation: found.recommendation,
            timestamp: 'Just now'
          }
        ]);
      }
    }, 450);
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

    // Match with preset if similar, otherwise give high-quality demo response
    const lower = query.toLowerCase();
    let matched = null;

    if (lower.includes('urgent') || lower.includes('priority')) {
      matched = askKutumbPresetResponses.find((p) => p.id === 'preset-4');
    } else if (lower.includes('papa') || lower.includes('rajesh') || lower.includes('father')) {
      matched = askKutumbPresetResponses.find((p) => p.id === 'preset-2');
    } else if (lower.includes('mummy') || lower.includes('sunita') || lower.includes('mother')) {
      matched = askKutumbPresetResponses.find((p) => p.id === 'preset-3');
    } else if (lower.includes('month') || lower.includes('september') || lower.includes('attention') || lower.includes('bill')) {
      matched = askKutumbPresetResponses.find((p) => p.id === 'preset-1');
    }

    setTimeout(() => {
      setIsTyping(false);
      if (matched) {
        setMessages((prev) => [
          ...prev,
          {
            id: `kutumb-${Date.now()}`,
            sender: 'kutumb',
            text: matched.answer,
            highlights: matched.highlights,
            recommendation: matched.recommendation,
            timestamp: 'Just now'
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `kutumb-${Date.now()}`,
            sender: 'kutumb',
            text: `I searched the Sharma Family vault for "${query}". In this foundation milestone, responses are mapped to synthetic family records. Full live LLM parsing with Gemini will be connected in Milestone 2.`,
            highlights: [
              {
                title: "Health Insurance Renewal (Highest Priority)",
                person: "Rajesh Sharma",
                date: "18 Sep 2026",
                amount: "₹28,450",
                badge: "Action Required",
                color: "rose"
              },
              {
                title: "Home Loan EMI (Joint Liability)",
                person: "Rajesh + Sunita",
                date: "25 Sep 2026",
                amount: "₹46,800",
                badge: "Active",
                color: "indigo"
              }
            ],
            recommendation: "Try clicking any of the preset question chips above to see detailed answers!",
            timestamp: 'Just now'
          }
        ]);
      }
    }, 500);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
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
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          Preset Questions (Click to test):
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => handleSelectPreset(q.id, q.label)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{q.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-2xl bg-slate-900/30 border border-slate-800/70 p-4 sm:p-6">
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
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {msg.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-xs">{item.title}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.color === 'rose'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.color === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
                        <span>{item.person}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-300">{item.date}</span>
                          <span className="font-bold text-amber-300">{item.amount}</span>
                        </div>
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
          placeholder="Ask a question (e.g. 'What is due next?', 'Show insurance details')..."
          className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:hover:brightness-100 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <span>Send</span>
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
