import React, { createContext, useContext, useState, useEffect } from 'react';
import { type PersonaId } from '../types/transformer';

export interface HistoryItem {
  id: string;
  timestamp: string;
  originalText: string;
  transformedText: string;
  persona: PersonaId;
  intentPreserved: boolean;
  risksFlagged: number;
  personaName?: string;
  factsFound?: number;
  factsTotal?: number;
  language?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarSeed: string;
  isLoggedIn: boolean;
}

export interface AppSettings {
  intentLockStrictness: 'lenient' | 'standard' | 'strict';
  defaultPersona: PersonaId;
  autoSaveHistory: boolean;
  soundEffects: boolean;
  preserveQuotes: boolean;
}

interface AppContextType {
  user: UserProfile;
  login: (email: string, name?: string) => void;
  logout: () => void;
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

// The Vault starts empty: it only ever holds your real transformations.
const INITIAL_HISTORY: HistoryItem[] = [];

const DEFAULT_SETTINGS: AppSettings = {
  intentLockStrictness: 'strict',
  defaultPersona: 'executive',
  autoSaveHistory: true,
  soundEffects: false,
  preserveQuotes: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('intent_shift_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      name: 'Guest User',
      email: '',
      role: 'Visitor',
      avatarSeed: 'guest',
      isLoggedIn: false
    };
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('intent_shift_history_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_HISTORY;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('intent_shift_settings');
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved), apiKey: undefined }; } catch { /* ignore */ }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('intent_shift_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('intent_shift_history_v2', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('intent_shift_settings', JSON.stringify(settings));
  }, [settings]);

  const login = (email: string, name?: string) => {
    setUser({
      name: name || email.split('@')[0].toUpperCase(),
      email,
      role: 'Communications Lead',
      avatarSeed: email,
      isLoggedIn: true
    });
  };

  const logout = () => {
    setUser({
      name: 'Guest User',
      email: '',
      role: 'Visitor',
      avatarSeed: 'guest',
      isLoggedIn: false
    });
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        history,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
        settings,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/** "Just now", "5m ago", "3h ago", or a date, from an ISO timestamp. */
export function timeAgo(iso: string) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 24 * 60) return `${Math.round(mins / 60)}h ago`;
  return new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
