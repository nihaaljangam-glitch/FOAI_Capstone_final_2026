import React, { useState } from 'react';
import { Database, Network, BookOpen, ScrollText, AlertTriangle, Download, Info, Zap, ChevronRight, Check, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function ValidationWorkbenchPage() {
  const { currentSession, sessions, loadSession, addNotification } = useApp();
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!currentSession) {
    return (
       <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-aetheric-bg">
          <div className="w-16 h-16 rounded-full bg-aetheric-pink/10 flex items-center justify-center mb-6">
             <Activity size={32} className="text-aetheric-pink" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Initialize Validation</h2>
          <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
            Please navigate to the Laboratory Playground or select a session from your chronology below to begin deep-dive analytical synthesis.
          </p>
          
          <div className="w-full max-w-md space-y-3 mb-8">
             {sessions.slice(0, 3).map(s => (
               <button 
                 key={s.id}
                 onClick={() => loadSession(s.id)}
                 className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-800 bg-[#0a0a0a] hover:border-aetheric-pink/50 transition group"
               >
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TL-{s.id.slice(0, 6).toUpperCase()}</div>
                    <div className="text-sm text-gray-300 font-medium italic">"{s.question.slice(0, 40)}..."</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-aetheric-pink transition-colors" />
               </button>
             ))}
          </div>

          <button 
            onClick={() => navigate('/playground')}
            className="px-8 py-3 bg-aetheric-pink rounded-lg text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(224,75,245,0.4)] transition"
          >
             Open Lab Playground
          </button>
       </div>
    );
  }

  // Get the first flagged hallucination if it exists, otherwise use a placeholder or the first answer
  const flaggedTag = currentSession?.hallucinations?.find(h => h.type === 'factual_error') || currentSession?.hallucinations?.[0];
  const firstAnswerText = currentSession?.answers?.[0]?.answer || "";
  const flaggedText = flaggedTag ? flaggedTag.selectedText : (firstAnswerText ? (firstAnswerText.split('.')[0] + '.') : "Analytical focus unassigned");

  const runVerification = (method) => {
    setActiveMethod(method);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addNotification('success', `${method.toUpperCase()} check completed for the current segment.`);
    }, 1500);
  };

  return (
    <div className="min-h-full p-8 flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center gap-3">
         <div className="px-3 py-1 rounded-full border border-aetheric-red/50 bg-aetheric-red/10 flex items-center gap-2">
            <div className={clsx("w-1.5 h-1.5 rounded-full bg-aetheric-red shadow-[0_0_8px_rgba(239,68,68,0.8)]", isVerifying && "animate-ping")}></div>
            <span className="text-[10px] font-bold text-aetheric-red uppercase tracking-widest">
              {flaggedTag ? `Flagged: OBJ-${flaggedTag.id.slice(0,4)}` : "Analyzing Primary Synthesis"}
            </span>
         </div>
         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">&bull; Critical Analysis Mode</span>
      </div>

      {/* Hero Card */}
      <div className="bg-aetheric-panel border-y border-r border-l-4 border-l-aetheric-pink border-y-aetheric-border border-r-aetheric-border rounded-xl p-8 relative overflow-hidden transition-all duration-500">
         <div className="absolute top-0 right-0 w-64 h-64 bg-aetheric-pink/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
         <p className="text-3xl text-gray-200 font-serif italic leading-relaxed max-w-4xl mb-6 relative z-10 transition-all">
            "{flaggedText}"
         </p>
         <div className="flex gap-6 relative z-10">
            <div className="flex items-center gap-2 text-gray-500">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Input: {currentSession.id.slice(0,8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
               <AlertTriangle size={14} className={flaggedTag ? "text-aetheric-red" : "text-gray-700"} />
               <span className={clsx("text-[10px] font-bold uppercase tracking-widest", flaggedTag ? "text-aetheric-red" : "text-gray-700")}>
                  Evidence Density: {flaggedTag ? "Low" : "Not Calculated"}
               </span>
            </div>
         </div>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Cross-Model Check */}
         <div 
           onClick={() => runVerification('cross')}
           className={clsx(
             "bg-[#0f0f0f] border rounded-xl p-6 group transition cursor-pointer relative overflow-hidden",
             activeMethod === 'cross' ? "border-purple-500" : "border-aetheric-border hover:border-gray-600"
           )}
         >
            {isVerifying && activeMethod === 'cross' && <div className="absolute bottom-0 left-0 h-1 bg-purple-500 animate-loading-bar"></div>}
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
               <Network size={20} className="text-purple-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              Cross-Model Check
              {activeMethod === 'cross' && !isVerifying && <Check size={16} className="text-aetheric-green" />}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">Verify claim consistency across 5 independent large language models.</p>
            <div className="flex items-center -space-x-2">
               <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0f0f0f] flex items-center justify-center text-[9px] text-gray-400 font-bold uppercase ring-1 ring-white/5">G</div>
               <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0f0f0f] flex items-center justify-center text-[9px] text-gray-400 font-bold uppercase ring-1 ring-white/5">C</div>
               <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0f0f0f] flex items-center justify-center text-[9px] text-gray-400 font-bold uppercase ring-1 ring-white/5">L</div>
               <div className="w-8 h-8 rounded-full bg-purple-900 border-2 border-[#0f0f0f] flex items-center justify-center text-[9px] text-white font-bold uppercase">+2</div>
            </div>
         </div>

         {/* External Sources */}
         <div 
            onClick={() => runVerification('source')}
            className={clsx(
              "bg-[#0f0f0f] border rounded-xl p-6 group transition cursor-pointer relative overflow-hidden",
              activeMethod === 'source' ? "border-aetheric-pink" : "border-aetheric-border hover:border-gray-600"
            )}
         >
            {isVerifying && activeMethod === 'source' && <div className="absolute bottom-0 left-0 h-1 bg-aetheric-pink animate-loading-bar"></div>}
            <div className="w-12 h-12 rounded-xl bg-aetheric-pink/10 border border-aetheric-pink/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(224,75,245,0.1)]">
               <BookOpen size={20} className="text-aetheric-pink" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              External Sources
              {activeMethod === 'source' && !isVerifying && <Check size={16} className="text-aetheric-green" />}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">Cross-reference with PubMed, ArXiv, and verified academic repositories.</p>
            <div className="px-3 py-1.5 rounded-lg border border-aetheric-pink/30 bg-aetheric-pink/5 inline-flex">
               <span className="text-[9px] font-bold text-aetheric-pink uppercase tracking-widest">7 Scholarly DB Active</span>
            </div>
         </div>

         {/* Rule-Based Logic */}
         <div 
           onClick={() => runVerification('logic')}
           className={clsx(
             "bg-[#0f0f0f] border rounded-xl p-6 group transition cursor-pointer relative overflow-hidden",
             activeMethod === 'logic' ? "border-blue-500" : "border-aetheric-border hover:border-gray-600"
           )}
         >
            {isVerifying && activeMethod === 'logic' && <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-loading-bar"></div>}
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
               <Zap size={20} className="text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              Rule-Based Logic
              {activeMethod === 'logic' && !isVerifying && <Check size={16} className="text-aetheric-green" />}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">Analyze against physical laws and pre-defined logical constraints.</p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800">
               <div className="w-2 h-2 rounded-full bg-aetheric-red"></div>
               <div className="w-2 h-2 rounded-full bg-gray-700"></div>
               <div className="w-2 h-2 rounded-full bg-gray-700"></div>
               <span className="text-[8px] font-bold text-gray-500 uppercase ml-1">Logic Scan Inactive</span>
            </div>
         </div>
      </div>

      <div className="flex gap-6 mt-2 flex-col lg:flex-row">
         {/* Findings Area */}
         <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
               <ScrollText size={18} className="text-aetheric-pink" />
               <h2 className="text-xl font-medium text-white">Summary of Findings</h2>
            </div>
            
            <div className="bg-[#111] border-l-2 border-aetheric-pink rounded-lg p-6 w-full shadow-xl">
               <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">Synthesized Analysis</div>
                  <div className={clsx(
                    "px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all",
                    flaggedTag?.type === 'factual_error' ? "border-aetheric-red/50 text-aetheric-red shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-gray-700 text-gray-500"
                  )}>
                    {flaggedTag ? "Contradiction Found" : "Under Scan"}
                  </div>
               </div>
               <p className="text-[17px] leading-relaxed text-gray-300 font-light">
                  {flaggedTag ? (
                    `Initial validation suggests that "${flaggedTag.selectedText}" diverges from confirmed historical datasets. Cross-model analysis indicates a probability of 84% that this artifact is a synthetic reasoning error.`
                  ) : (
                    "No critical contradictions identified in the primary segment. Please select a specific claim in the Comparison View to perform a deep-dive validation protocol."
                  )}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition">
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Model Consensus</div>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                     4/5 models disagreed on the terminology used in the claim.
                  </p>
               </div>
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition">
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Logical consistency</div>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                     Chain of reasoning [3.2 {"->"} 3.3] lacks semantic support.
                  </p>
               </div>
            </div>
         </div>

         {/* Status Area */}
         <div className="w-[300px] flex flex-col gap-4">
            <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6 flex-1 flex flex-col items-center text-center shadow-2xl">
               <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 w-full text-left">Validation Status</div>
               <div className="flex items-end gap-3 mb-8 w-full">
                  <h2 className={clsx(
                    "text-5xl font-bold font-serif transition-all duration-700",
                    flaggedTag ? "text-aetheric-red drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-gray-700"
                  )}>
                    {flaggedTag ? "Invalid" : "Clear"}
                  </h2>
                  <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest text-left leading-tight bg-[#070707] p-2 rounded border border-white/5">
                    <div>Certainty:</div>
                    <span className={flaggedTag ? "text-white" : "text-gray-700"}>
                      {flaggedTag ? "92%" : "N/A"}
                    </span>
                  </div>
               </div>
               
               <div className="w-full space-y-4 border-t border-gray-800 pt-6 mb-8">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 uppercase font-bold tracking-widest text-[9px]">Check Time</span>
                     <span className="text-white font-mono">{isVerifying ? "..." : "1.4s"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 uppercase font-bold tracking-widest text-[9px]">Confidence</span>
                     <span className="text-white font-mono">High</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500 uppercase font-bold tracking-widest text-[9px]">Sources Used</span>
                     <span className="text-white font-mono">14</span>
                  </div>
               </div>

               <button className="w-full py-4 bg-gradient-to-r from-aetheric-pink to-purple-600 rounded-lg text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(224,75,245,0.4)] hover:shadow-[0_0_25px_rgba(224,75,245,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4 group">
                  <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export Report
               </button>
               <button 
                 onClick={() => navigate('/comparison')}
                 className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:text-white transition"
               >
                 Back to Tagging
               </button>
            </div>

            <div className="bg-[#0f0f0f] border border-aetheric-border border-l-2 border-l-purple-500 rounded-xl p-5 group hover:bg-[#151515] transition-colors">
               <div className="flex items-center gap-2 text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-3">
                  <Info size={12} /> Suggested Correction
               </div>
               <p className="text-xs text-gray-400 font-serif italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {flaggedTag ? (
                    `Synthesized data suggests replacing "${flaggedTag.selectedText}" with verified scholarly terminology to align with established consensus.`
                  ) : (
                    "No corrections suggested yet. Awaiting full analysis of primary output."
                  )}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
