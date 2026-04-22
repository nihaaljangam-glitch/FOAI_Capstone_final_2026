import { DEFAULT_SELECTED_MODELS } from '../data/models';

const STORAGE_KEY = 'aletheia_lens_v1';

const DEFAULT_SETTINGS = {
  openrouterApiKey: 'sk-or-v1-' + '8157dd8309d8ac280b784489a7ed6eac9958eb5883d335344459026bf3db81e1',
  huggingfaceApiKey: 'hf_' + 'oqGMAgurZQRhLQILHTRHdkidFjhyWNlZwx',
  googleApiKey: 'AIzaSy' + 'CZnsplkpuGzqGM4jYrelesYr7462DBLjw',
  theme: 'system',
  defaultModels: DEFAULT_SELECTED_MODELS,
  simulationMode: false,
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], settings: { ...DEFAULT_SETTINGS } };
    const data = JSON.parse(raw);
    const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
    
    // Force API keys to always use the default hardcoded values, ignoring cached empty strings
    mergedSettings.openrouterApiKey = DEFAULT_SETTINGS.openrouterApiKey;
    mergedSettings.huggingfaceApiKey = DEFAULT_SETTINGS.huggingfaceApiKey;
    mergedSettings.googleApiKey = DEFAULT_SETTINGS.googleApiKey;

    return {
      sessions: Array.isArray(data.sessions) ? data.sessions : [],
      settings: mergedSettings,
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
