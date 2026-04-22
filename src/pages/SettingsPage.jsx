import React, { useState } from 'react';
import { Save, Key, LayoutGrid, ShieldAlert, Palette, ChevronRight, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_MODELS } from '../data/models';
import clsx from 'clsx';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();

  const [defaultModels, setDefaultModels] = useState(settings.defaultModels);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleModel = (id) => {
    setDefaultModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    updateSettings({
      ...settings,
      defaultModels: defaultModels,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-full p-8 flex flex-col max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Settings</h1>
        <p className="text-gray-400 text-sm">Configure your analytical workspace and API credentials.</p>
      </div>

      <div className="space-y-6">
        {/* API Section — Pre-configured */}
        <section className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-emerald-400" size={18} />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">API Credentials</h2>
            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pre-Configured</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-gray-800">
              <Key className="text-aetheric-pink flex-shrink-0" size={14} />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">OpenRouter API Key</p>
                <p className="text-sm text-gray-300 font-mono mt-0.5">sk-or-v1-••••••••••••e1</p>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-gray-800">
                <Key className="text-aetheric-pink flex-shrink-0" size={14} />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Hugging Face Token</p>
                  <p className="text-sm text-gray-300 font-mono mt-0.5">hf_••••••••••••wx</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-gray-800">
                <Key className="text-aetheric-pink flex-shrink-0" size={14} />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Google AI API Key</p>
                  <p className="text-sm text-gray-300 font-mono mt-0.5">AIza••••••••••••jw</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 italic">All API keys are pre-configured. No setup required.</p>
          </div>
        </section>

        {/* Engine Presets Section */}
        <section className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid className="text-aetheric-pink" size={18} />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">Engine Presets</h2>
              <p className="text-xs text-gray-500">Select the default models to query for new sessions.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_MODELS.map((model) => {
              const isActive = defaultModels.includes(model.id);
              return (
                <button
                  key={model.id}
                  onClick={() => handleToggleModel(model.id)}
                  className={clsx(
                    "flex flex-col items-start p-4 rounded-xl border transition text-left group",
                    isActive 
                      ? "bg-aetheric-pink/5 border-aetheric-pink" 
                      : "bg-[#0a0a0a] border-gray-800 hover:border-gray-600"
                  )}
                >
                  <div className="flex justify-between items-start w-full mb-3">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{model.provider}</span>
                    {isActive && <div className="w-4 h-4 rounded-full bg-aetheric-pink flex items-center justify-center text-white"><Check size={10} /></div>}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-aetheric-pink transition">{model.name}</h4>
                </button>
              );
            })}
          </div>
        </section>

        {/* Appearance Placeholder */}
        <section className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6 opacity-60">
          <div className="flex items-center gap-3">
            <Palette className="text-gray-500" size={18} />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wider">Appearance</h2>
              <p className="text-[10px] text-gray-600 font-mono">SYSTEM_THEME_LOCKED: AETHERIC_DARK</p>
            </div>
            <ChevronRight size={16} className="text-gray-700" />
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className={clsx(
              "flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold text-xs uppercase tracking-[0.2em] transition-all",
              isSaved ? "bg-aetheric-green" : "bg-aetheric-pink hover:shadow-[0_0_20px_rgba(224,75,245,0.4)]"
            )}
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            {isSaved ? "Saved" : "Save Settings"}
          </button>
        </div>
      </div>
      
      {/* Simulation Toggle */}
      <div className="mt-12 p-6 border border-dashed border-gray-800 rounded-xl">
        <div className="flex items-center gap-4">
          <ShieldAlert className={clsx("transition-colors", settings.simulationMode ? "text-aetheric-green" : "text-amber-500")} size={24} />
          <div className="flex-1">
             <h4 className="text-sm font-bold text-white uppercase tracking-widest">Developer Simulation Mode</h4>
             <p className="text-xs text-gray-500">If active, Aletheia Lens will use high-fidelity synthetic data instead of querying live models via API.</p>
          </div>
          <button 
             onClick={() => updateSettings({ ...settings, simulationMode: !settings.simulationMode })}
             className={clsx(
               "px-4 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition",
               settings.simulationMode 
                 ? "bg-aetheric-green/10 border-aetheric-green/50 text-aetheric-green hover:bg-aetheric-green/20" 
                 : "bg-[#222] border-gray-700 text-amber-500 hover:bg-amber-500/10"
             )}
          >
             {settings.simulationMode ? "Simulation Active" : "Enable Simulation"}
          </button>
        </div>
      </div>
    </div>
  );
}
