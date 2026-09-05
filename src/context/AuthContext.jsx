import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'kutumb_current_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userId) return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback((rawUserId, displayName) => {
    const userId = (rawUserId || '').trim().toUpperCase();
    if (!userId) return false;
    const u = { userId, displayName: (displayName || '').trim() || userId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
