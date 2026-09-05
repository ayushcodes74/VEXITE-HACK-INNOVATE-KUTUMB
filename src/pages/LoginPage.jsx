import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OLIVE = '#5a7a4a';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isEntering, setIsEntering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('Please enter a User ID.');
      return;
    }

    const normalized = userId.trim().toUpperCase();
    if (normalized.length < 3) {
      setError('User ID must be at least 3 characters.');
      return;
    }

    setIsEntering(true);
    // Brief delay for polish
    setTimeout(() => {
      login(normalized, displayName.trim() || normalized);
      navigate('/', { replace: true });
    }, 250);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#FAF8F5' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm space-y-8 animate-fadeIn"
      >
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(90,122,74,0.1)', border: '1px solid rgba(90,122,74,0.2)' }}
            >
              <Leaf className="w-5 h-5" style={{ color: OLIVE }} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight" style={{ color: '#111111' }}>KUTUMB</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(90,122,74,0.08)', color: OLIVE, border: '1px solid rgba(90,122,74,0.18)' }}
                >
                  OS
                </span>
              </div>
              <p className="text-[11px] font-medium" style={{ color: '#888888' }}>Family Knowledge</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
            Your family knowledge, organized in one place.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* User ID */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#888888' }}>
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setError(''); }}
                placeholder="e.g. RAJESH001"
                autoFocus
                autoComplete="username"
                className="k-input w-full text-sm"
                style={{ padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Display name (optional) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#AAAAAA' }}>
                Display Name <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                autoComplete="name"
                className="k-input w-full text-sm"
                style={{ padding: '0.75rem 1rem' }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-medium" style={{ color: '#c0392b' }}>{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!userId.trim() || isEntering}
            className="k-btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
          >
            {isEntering ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entering…
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Enter KUTUMB</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-[10px] leading-relaxed" style={{ color: '#AAAAAA' }}>
          Demo User ID gate for hackathon judging.<br />
          Not production-grade authentication.
        </p>
      </div>
    </div>
  );
}
