import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadSessions, loadSettings, saveSession as saveSessionToStorage, saveSettings as saveSettingsToStorage, saveData } from '../utils/storage';
import { DEMO_SESSIONS } from '../data/demoData';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [settings, setSettings] = useState(loadSettings());
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load INITIAL data from storage with sanitization and demo auto-injection
  useEffect(() => {
    let rawSessions = loadSessions();
    
    // Auto-injection disabled per user request to keep workspace empty
    // Only sanitized existing sessions

    const sanitizedSessions = rawSessions.map(s => ({
      ...s,
      answers: Array.isArray(s.answers) ? s.answers : [],
      hallucinations: Array.isArray(s.hallucinations) ? s.hallucinations : [],
      id: s.id || Math.random().toString(36).slice(2)
    }));
    setSessions(sanitizedSessions);
    setSettings(loadSettings());
  }, []);

  const addNotification = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications((prev) => [...prev, { id, type, message, createdAt: new Date().toISOString() }]);
    // Auto remove after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const startNewSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const loadSession = useCallback((id) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setCurrentSession(session);
    }
  }, [sessions]);

  const updateCurrentSession = useCallback((updates) => {
    setCurrentSession((prev) => {
      // If we're setting a whole session or updates for the first time
      const base = prev || {};
      return { ...base, ...updates, updatedAt: new Date().toISOString() };
    });
  }, []);

  const commitSession = useCallback((session) => {
    saveSessionToStorage(session);
    const updatedSessions = loadSessions(); // Re-load to get the sorted list
    setSessions(updatedSessions);
    setCurrentSession(session);
    addNotification('success', 'Session saved successfully');
  }, [addNotification]);

  const updateSettings = useCallback((newSettings) => {
    saveSettingsToStorage(newSettings);
    setSettings(newSettings);
    addNotification('success', 'Settings updated');
  }, [addNotification]);

  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const loadDemoData = useCallback(() => {
    saveData(DEMO_SESSIONS, settings);
    setSessions(DEMO_SESSIONS);
    addNotification('info', 'Research samples loaded into laboratory environment');
  }, [settings, addNotification]);

  const value = {
    sessions,
    currentSession,
    settings,
    notifications,
    isLoading,
    startNewSession,
    loadSession,
    updateCurrentSession,
    commitSession,
    addNotification,
    removeNotification,
    updateSettings,
    setLoading,
    loadDemoData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
