/**
 * API Keys and data storage utility
 * Manages local storage for API keys and user session data
 */

import { DEFAULT_SELECTED_MODELS } from '../data/models';

const STORAGE_KEY = 'ai_truthlens_v1';

const DEFAULT_SETTINGS = {
  openrouterApiKey: '',
  huggingfaceApiKey: '',
  googleApiKey: '',
  theme: 'system',
  defaultModels: DEFAULT_SELECTED_MODELS,
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], settings: { ...DEFAULT_SETTINGS } };
    const data = JSON.parse(raw);
    return {
      sessions: Array.isArray(data.sessions) ? data.sessions : [],
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  } catch {
    return { sessions: [], settings: { ...DEFAULT_SETTINGS } };
  }
}

export function saveData(sessions, settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, settings }));
}

export function loadSessions() {
  return loadData().sessions;
}

export function loadSettings() {
  return loadData().settings;
}

export function saveSession(session) {
  const { sessions, settings } = loadData();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  saveData(sessions, settings);
}

export function deleteSession(id) {
  const { sessions, settings } = loadData();
  saveData(sessions.filter((s) => s.id !== id), settings);
}

export function saveSettings(settings) {
  const { sessions } = loadData();
  saveData(sessions, settings);
}

export function exportDataJSON() {
  return JSON.stringify(loadData(), null, 2);
}

export function importDataJSON(json) {
  try {
    const data = JSON.parse(json);
    if (typeof data === 'object' && data !== null) {
      saveData(
        Array.isArray(data.sessions) ? data.sessions : [],
        { ...DEFAULT_SETTINGS, ...(data.settings || {}) }
      );
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}
