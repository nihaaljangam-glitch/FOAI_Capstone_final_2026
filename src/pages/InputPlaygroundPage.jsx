import React, { useState } from 'react';
import { Settings, ShieldCheck, BookOpen, Activity, Library, UserCog, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_MODELS, MODEL_MAP } from '../data/models';
import { useNavigate } from 'react-router-dom';
import { queryAllModels } from '../utils/api';
import { DEMO_SESSIONS } from '../data/demoData';
import clsx from 'clsx';

export default function InputPlaygroundPage() {
  const { settings, updateCurrentSession, commitSession, addNotification, setLoading, isLoading } = useApp();
  const [question, setQuestion] = useState("");
  const [selectedModelIds, setSelectedModelIds] = useState(settings.defaultModels);
  const navigate = useNavigate();

  const handleToggleModel = (id) => {
    setSelectedModelIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleInitialize = async () => {
    if (!question.trim()) {
      addNotification('error', 'Please enter an inquiry first.');
      return;
    }
    if (selectedModelIds.length === 0) {
      addNotification('error', 'Select at least one analytical engine.');
      return;
    }

    setLoading(true);
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    
    // Preparation for Session
    const modelsToQuery = selectedModelIds.map(id => {
      const m = MODEL_MAP.get(id);
      return { id: m.id, name: m.name };
    });

    let answers = [];

    try {
      if (settings.simulationMode) {
        await new Promise(r => setTimeout(r, 1500)); // Simulate API round trips
        answers = [...DEMO_SESSIONS[0].answers].map(ans => ({
          ...ans,
          // Assign synthetic answers to the selected models
          modelId: modelsToQuery[Math.floor(Math.random() * modelsToQuery.length)].id,
        })).slice(0, modelsToQuery.length); 
      } else {
        answers = await queryAllModels(modelsToQuery, question, settings.openrouterApiKey, (ans) => {
          // Progress update if we had a multi-stage UI, but let's wait for all here
        });
      }

      const newSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        question: question,
        selectedModels: selectedModelIds,
        answers: answers,
        hallucinations: [],
        status: 'in_progress'
      };

      commitSession(newSession);
      navigate('/comparison');
    } catch (err) {
      addNotification('error', 'Query failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx("min-h-full p-10 flex flex-col items-center transition-opacity", isLoading && "opacity-50 pointer-events-none")}>
      
      {/* Header section */}
      <div className="mt-8 mb-12 flex flex-col items-center text-center max-w-2xl">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-aetheric-pink/30 bg-aetheric-pink/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-aetheric-pink animate-pulse"></div>
            <span className="text-[10px] font-bold text-aetheric-pink tracking-[0.2em] uppercase">Validation Playground</span>
         </div>
         
         <h1 className="text-6xl font-bold tracking-tight mb-4 text-white">
            Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-aetheric-pink to-purple-500">Inquiry</span>
         </h1>
         <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Leverage multi-engine synthesis to verify factual consistency and structural logic in your research questions.
         </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-3xl bg-aetheric-panel border border-aetheric-border rounded-xl p-6 shadow-2xl mb-12 focus-within:border-aetheric-pink/50 transition-colors">
        <textarea 
          className="w-full h-32 bg-transparent border-none text-2xl text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-0 resize-none font-light"
          placeholder="What is the historical impact of the silk road on Mediterranean architecture?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="flex justify-between items-center mt-4 border-t border-aetheric-border pt-4">
           <div className="flex items-center gap-2 text-aetheric-pink">
              <Activity size={14} className={clsx(isLoading && "animate-spin")} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {isLoading ? "Synthesizing intelligence..." : "Contextual Intelligence Active"}
              </span>
           </div>
           <div className="text-[10px] text-gray-500 font-mono tracking-widest">
              {question.length} CHARACTERS
           </div>
        </div>
      </div>

      {/* Models Section */}
      <div className="w-full max-w-3xl mb-12">
        <div className="flex justify-between items-end mb-4">
           <h3 className="text-white font-bold text-sm uppercase tracking-widest">Select Analytical Engines</h3>
           <button 
             onClick={() => navigate('/settings')}
             className="flex items-center gap-2 text-aetheric-pink text-[10px] font-bold uppercase tracking-widest hover:text-white transition"
           >
              <Settings size={14} /> Engine Presets
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {AVAILABLE_MODELS.slice(0, 3).map((model) => {
             const isActive = selectedModelIds.includes(model.id);
             return (
               <div 
                 key={model.id}
                 onClick={() => handleToggleModel(model.id)}
                 className={clsx(
                   "bg-aetheric-panel border rounded-xl p-5 relative overflow-hidden group cursor-pointer transition-all",
                   isActive ? "border-aetheric-pink ring-1 ring-aetheric-pink/20" : "border-aetheric-border hover:border-gray-600"
                 )}
               >
                  {isActive && <div className="absolute inset-0 bg-aetheric-pink/5 pointer-events-none"></div>}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-colors",
                      isActive ? "bg-white text-black" : "bg-[#2A2A2A] text-gray-400"
                    )}>
                      {model.name.split(' ')[0].toLowerCase()}
                    </div>
                    {isActive ? (
                      <div className="px-2 py-0.5 rounded bg-aetheric-pink text-[9px] text-white uppercase tracking-wider font-bold">Active</div>
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-600"></div>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1 relative z-10">{model.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-tight relative z-10">{model.description}</p>
               </div>
             )
           })}
        </div>
      </div>

      <button 
        onClick={handleInitialize}
        disabled={isLoading}
        className="px-12 py-4 bg-gradient-to-r from-aetheric-pink to-purple-600 rounded-lg text-white font-bold text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(224,75,245,0.4)] hover:shadow-[0_0_40px_rgba(224,75,245,0.6)] transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
         {isLoading ? "Processing..." : "Initialize Comparison"}
      </button>
      
      <div className="flex items-center gap-8 mb-20 text-[10px] font-bold text-aetheric-pink uppercase tracking-widest">
         <div className="flex items-center gap-2"><ShieldCheck size={14} /> Privacy Secured</div>
         <div className="flex items-center gap-2"><BookOpen size={14} /> Scholarly Standard</div>
      </div>

      {/* Footer Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
         {/* Methodology */}
         <div className="bg-aetheric-panel border border-aetheric-border rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-aetheric-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="text-[10px] font-bold text-aetheric-pink tracking-[0.2em] uppercase mb-4">Process Methodology</div>
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
               The Power of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-aetheric-pink to-purple-500">Engine Consensus.</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
               TruthLens cross-references semantic weights across different neural architectures to isolate cognitive hallucinations before they impact your findings.
            </p>
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                  <div className="text-2xl font-bold text-white mb-1">98.4%</div>
                  <div className="text-[9px] font-bold text-aetheric-pink tracking-wider uppercase">Reliability Peak</div>
               </div>
               <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                  <div className="text-2xl font-bold text-white mb-1">0.12s</div>
                  <div className="text-[9px] font-bold text-aetheric-pink tracking-wider uppercase">Inference Speed</div>
               </div>
            </div>
         </div>
         
         <div className="flex flex-col gap-6">
            <div className="bg-aetheric-panel border border-aetheric-border rounded-2xl p-8 flex-1 relative overflow-hidden group hover:border-aetheric-pink/30 transition-colors">
               <div className="w-16 h-16 bg-aetheric-pink rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(224,75,245,0.4)] group-hover:scale-110 transition-transform">
                 <Library size={32} className="text-white" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Knowledge Base</h3>
               <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Access peer-reviewed libraries of AI-generated histories.</p>
               <button className="text-[10px] font-bold text-aetheric-pink tracking-widest uppercase hover:text-white transition">Browse Archive</button>
            </div>
            
            <div 
               onClick={() => navigate('/workbench')}
               className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-aetheric-border rounded-2xl p-8 flex-[0.7] relative overflow-hidden flex flex-col justify-end group cursor-pointer hover:border-aetheric-pink/30 transition-colors"
            >
               <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent"></div>
               <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Curator Mode</h3>
               <p className="text-[10px] text-gray-500 relative z-10">Enable editorial oversight for citation tracking.</p>
               <div className="absolute right-6 bottom-6 w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-aetheric-pink/50 transition-colors">
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-aetheric-pink transition-colors" />
               </div>
            </div>
         </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-aetheric-border pt-12 pb-6 px-12 flex justify-between items-start mt-auto">
         <div>
            <h2 className="text-lg font-bold text-white mb-1 tracking-tight">TruthLens</h2>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">Autonomous Analytical Framework</p>
         </div>
         <div className="flex gap-16 text-xs">
            <div>
               <h4 className="text-[10px] font-bold text-aetheric-pink uppercase tracking-widest mb-4">Intelligence</h4>
               <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition">Methodology</li>
                  <li className="hover:text-white cursor-pointer transition">Ethics Engine</li>
               </ul>
            </div>
            <div>
               <h4 className="text-[10px] font-bold text-aetheric-pink uppercase tracking-widest mb-4">Platform</h4>
               <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition">Privacy Core</li>
                  <li className="hover:text-white cursor-pointer transition">Terms of Use</li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}

function ChevronRight({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
