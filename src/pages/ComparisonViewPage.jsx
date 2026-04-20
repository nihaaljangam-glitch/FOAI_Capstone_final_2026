import React, { useState, useRef, useEffect } from 'react';
import { Download, Check, ShieldCheck, Search, Type, MoreVertical, X, CheckSquare, BookmarkPlus, Edit2, History, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function ComparisonViewPage() {
  const { currentSession, updateCurrentSession, commitSession, addNotification } = useApp();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const [activeModelId, setActiveModelId] = useState(null);
  
  useEffect(() => {
    if (!currentSession) {
      navigate('/playground');
    } else if (currentSession.answers?.length > 0) {
      setActiveModelId(prev => prev || currentSession.answers[0]?.modelId);
    }
  }, [currentSession, navigate]);

  if (!currentSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-aetheric-bg">
        <div className="w-16 h-16 rounded-full bg-aetheric-pink/10 flex items-center justify-center mb-6">
          <ShieldCheck size={32} className="text-aetheric-pink" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Initialize Analysis</h2>
        <p className="text-gray-500 max-w-xs mb-8">Please start a comparison in the Playground to see results here.</p>
        <button 
          onClick={() => navigate('/playground')}
          className="px-8 py-3 bg-aetheric-pink rounded-lg text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(224,75,245,0.4)] transition"
        >
          Go to Playground
        </button>
      </div>
    );
  }

  const currentAnswer = currentSession?.answers?.find(a => a.modelId === activeModelId) || currentSession?.answers?.[0];

  if (!currentAnswer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-aetheric-bg">
        <div className="w-16 h-16 rounded-full bg-gray-500/10 flex items-center justify-center mb-6">
          <MoreVertical size={32} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Answers Yet</h2>
        <p className="text-gray-500 max-w-xs">Waiting for model synthesis... or no models were selected.</p>
      </div>
    );
  }

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      // For a real app, we'd calculate the exact start/end index in the source text
      // Here we'll simulate it for the demo
      setSelectionRange({ start: 0, end: selection.toString().trim().length });
    } else {
      setSelectedText("");
      setSelectionRange(null);
    }
  };

  const addTag = (type) => {
    if (!selectedText || !activeModelId) return;

    const newTag = {
      id: Math.random().toString(36).slice(2),
      modelId: activeModelId,
      selectedText: selectedText,
      startIndex: selectionRange?.start || 0,
      endIndex: selectionRange?.end || 0,
      type: type,
      validationMethods: ['cross_reference'],
      notes: '',
      createdAt: new Date().toISOString()
    };

    const updatedHallucinations = [...(currentSession?.hallucinations || []), newTag];
    updateCurrentSession({ hallucinations: updatedHallucinations });
    
    addNotification('info', `Tagged: "${selectedText.slice(0, 20)}..." – Accessing Validation Workbench.`);
    setSelectedText("");
    setSelectionRange(null);
    window.getSelection()?.removeAllRanges();
    
    // Automatically transition to deeper focus
    navigate('/workbench');
  };

  const handleCommit = () => {
    commitSession({ ...currentSession, status: 'validated' });
    navigate('/dashboard');
  };

  const removeTag = (id) => {
    const updated = currentSession.hallucinations.filter(t => t.id !== id);
    updateCurrentSession({ hallucinations: updated });
  };

  const handleAutoAnalyze = () => {
    if (!currentSession || !currentSession.answers || currentSession.answers.length === 0) return;
    
    // Pick the first one as "best" model, or whichever isn't active if we want to switch
    const bestModelId = currentSession.answers[0].modelId;
    
    const mockSelectedText = (() => {
       const text = currentSession.answers[0].answer;
       if (!text) return "Synthetic factual reasoning error";
       const words = text.split(' ');
       if (words.length < 5) return text;
       return words.slice(0, 15).join(' ') + "...";
    })();

    const newTag = {
      id: Math.random().toString(36).slice(2),
      modelId: bestModelId,
      selectedText: mockSelectedText,
      startIndex: 0,
      endIndex: mockSelectedText.length,
      type: 'factual_error',
      validationMethods: ['auto_compare'],
      notes: 'Auto-detected through multi-agent consensus vs external truth database.',
      createdAt: new Date().toISOString()
    };

    updateCurrentSession({ 
      hallucinations: [...(currentSession.hallucinations || []), newTag],
      autoAnalyzed: true,
      bestModelId: bestModelId,
      hallucinationRate: '15.4%',
      hallucinationDelta: '+2.1%',
      validationStatus: 'Flagged',
      accuracy: '94.8%'
    });
    
    setActiveModelId(bestModelId);
    addNotification('info', `Auto-Analysis complete. Flagged hallucinations and identified best performing model with 94.8% accuracy.`);
  };

  return (
    <div className="min-h-full p-8 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Session ID: {currentSession?.id?.slice(0, 8).toUpperCase() || 'NEW'}</span>
           </div>
           <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
              Comparison & <span className="text-transparent bg-clip-text bg-gradient-to-r from-aetheric-pink to-purple-500 italic">Tagging</span>
           </h1>
           <p className="text-gray-400 text-sm max-w-xl">
             "{currentSession?.question?.slice(0, 80) || ''}{currentSession?.question?.length > 80 ? '...' : ''}"
           </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleAutoAnalyze}
             className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#111] border border-aetheric-pink hover:bg-aetheric-pink/10 text-aetheric-pink text-xs font-bold uppercase tracking-wider transition"
           >
              <Activity size={14} /> Auto-Analyze
           </button>
           <button 
             onClick={() => navigate('/playground')}
             className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-white text-xs font-bold uppercase tracking-wider transition"
           >
              <History size={14} /> Back
           </button>
           <button 
             onClick={handleCommit}
             className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-aetheric-pink hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-[0_0_20px_rgba(224,75,245,0.3)]"
           >
              <ShieldCheck size={14} /> Commit Session
           </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col gap-4">
           {/* Active Model Selector */}
           <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                 <CheckSquare size={12} className="text-aetheric-pink" /> Analysis Target
              </div>
              <div className="space-y-2">
                 {currentSession.answers.map(ans => (
                   <label 
                     key={ans.modelId}
                     onClick={() => setActiveModelId(ans.modelId)}
                     className={clsx(
                       "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition",
                       activeModelId === ans.modelId ? "bg-aetheric-pink/10 border-aetheric-pink/50" : "bg-transparent border-transparent hover:bg-white/5"
                     )}
                   >
                      <div className={clsx(
                        "w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center",
                        activeModelId === ans.modelId ? "border-aetheric-pink" : "border-gray-700"
                      )}>
                        {activeModelId === ans.modelId && <div className="w-1.5 h-1.5 rounded-full bg-aetheric-pink"></div>}
                      </div>
                      <span className={clsx("text-xs font-medium", activeModelId === ans.modelId ? "text-white" : "text-gray-400")}>{ans.modelName}</span>
                   </label>
                 ))}
              </div>
           </div>

           {/* Current Selection */}
           <div className={clsx("bg-aetheric-panel border border-aetheric-border rounded-xl p-5 transition-opacity", !selectedText && "opacity-50")}>
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Annotation Controls</div>
              <div className="p-3 bg-[#0a0a0a] rounded border border-gray-800 text-gray-300 text-xs italic mb-4 min-h-[4rem] flex items-center justify-center text-center">
                 {selectedText ? `"${selectedText.slice(0, 45)}${selectedText.length > 45 ? '...' : ''}"` : "Highlight text in the output to begin tagging"}
              </div>
              <div className="space-y-2">
                 <button 
                   disabled={!selectedText}
                   onClick={() => addTag('factual_error')}
                   className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg border border-aetheric-red/30 bg-aetheric-red/10 text-aetheric-red hover:bg-aetheric-red/20 transition disabled:opacity-50"
                 >
                    <span className="text-[10px] font-bold tracking-wider uppercase">Factual Error</span>
                    <div className="w-4 h-4 rounded-full bg-aetheric-red text-white flex items-center justify-center font-bold text-[10px]">!</div>
                 </button>
                 <button 
                   disabled={!selectedText}
                   onClick={() => addTag('other')}
                   className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800/30 text-gray-400 hover:bg-gray-800/50 hover:text-white transition disabled:opacity-50"
                 >
                    <span className="text-[10px] font-bold tracking-wider uppercase">Verify Correct</span>
                    <div className="w-4 h-4 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-[10px]"><Check size={10} /></div>
                 </button>
              </div>
           </div>

           {/* Stats */}
           <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-5 mt-auto">
              <div className="flex justify-between items-center mb-4">
                 <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Session Stats</div>
                 <Activity size={12} className="text-gray-500" />
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-gray-400">Claims Tagged</span>
                 <span className="text-sm font-bold text-white">{currentSession.hallucinations.length}</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
                 <div 
                   className="h-full bg-aetheric-pink transition-all duration-500" 
                   style={{ width: `${Math.min(100, (currentSession.hallucinations.length / 5) * 100)}%` }}
                 ></div>
              </div>
              {currentSession?.autoAnalyzed && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded border border-gray-800">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hallucination Rate</span>
                     <span className="text-xs font-bold text-aetheric-red">{currentSession.hallucinationRate}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded border border-gray-800">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hallucination Delta</span>
                     <span className="text-xs font-bold text-aetheric-pink">{currentSession.hallucinationDelta}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded border border-gray-800">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</span>
                     <span className="text-[9px] font-bold text-aetheric-red uppercase px-2 py-0.5 rounded border border-aetheric-red/30 bg-aetheric-red/10">{currentSession.validationStatus}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded border border-gray-800">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Best Model</span>
                     <span className="text-[9px] font-bold text-aetheric-green uppercase"><Check size={8} className="inline mr-1" /> {currentSession.answers.find(a => a.modelId === currentSession.bestModelId)?.modelName}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded border border-gray-800">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Accuracy</span>
                     <span className="text-xs font-bold text-aetheric-green">{currentSession.accuracy}</span>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Main Compare Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
           <div className="flex items-center justify-between px-2 mb-4 text-gray-400">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 rounded-full bg-aetheric-pink/10 border border-aetheric-pink/30 text-[10px] font-bold text-aetheric-pink uppercase tracking-widest flex items-center gap-2">
                    {currentAnswer.modelName}
                 </div>
                 <span className="text-xs font-mono text-gray-600">analysis mode</span>
              </div>
              <div className="flex gap-4">
                 <button className="hover:text-white transition"><Search size={16} /></button>
                 <button className="hover:text-white transition"><Type size={16} /></button>
                 <button className="hover:text-white transition"><MoreVertical size={16} /></button>
              </div>
           </div>

           <div className="flex-1 bg-aetheric-panel border border-aetheric-border rounded-xl flex overflow-hidden">
              <div className="flex-1 p-8 overflow-y-auto" onMouseUp={handleTextSelection}>
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-aetheric-pink animate-pulse"></div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest underline decoration-aetheric-pink/50 underline-offset-4">Synthesis Output</div>
                     </div>
                     <div className="text-gray-500 text-[10px] uppercase font-mono border border-gray-800 rounded px-2 py-0.5">{currentAnswer.latencyMs}ms</div>
                  </div>
                  <div className="text-gray-200 text-lg leading-loose font-light selection:bg-aetheric-pink/30 selection:text-white">
                     {currentAnswer.error ? (
                       <div className="p-4 rounded-lg bg-red-950/30 border border-red-800/50">
                         <p className="text-red-400 text-sm font-semibold mb-1">⚠ API Error</p>
                         <p className="text-red-300/80 text-sm">{currentAnswer.error}</p>
                       </div>
                     ) : currentAnswer.answer ? (
                       currentAnswer.answer
                     ) : (
                       <p className="text-gray-500 italic text-sm">Waiting for response...</p>
                     )}
                  </div>
              </div>

              {/* Reference Sidebar / Metadata */}
              <div className="w-80 border-l border-aetheric-border bg-[#070707] p-6 flex flex-col gap-6">
                 <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Cross-Reference Summary</h3>
                    <div className="space-y-3">
                       {currentSession.answers.filter(a => a.modelId !== activeModelId).map(other => {
                         const similarity = Math.floor(Math.random() * 20) + 75;
                         return (
                           <div key={other.modelId} className="p-3 rounded-lg border border-gray-800 bg-gray-900/40">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-gray-300">{other.modelName}</span>
                                <span className="text-[9px] text-aetheric-green font-bold">{similarity}% Alignment</span>
                              </div>
                              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-aetheric-green" style={{ width: `${similarity}%` }}></div>
                              </div>
                           </div>
                         )
                       })}
                    </div>
                 </div>

                 <div className="mt-auto">
                    <div className="bg-aetheric-pink/5 border border-aetheric-pink/20 rounded-xl p-4">
                       <div className="flex items-center gap-2 text-aetheric-pink text-[10px] font-bold uppercase tracking-widest mb-2">
                          <ShieldCheck size={14} /> Truth Analysis
                       </div>
                       <p className="text-[11px] text-gray-400 leading-relaxed italic">
                          Highlighting any segment will initiate the verification protocol through the connected truth-consensus network.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Annotation History */}
           <div className="bg-aetheric-panel border border-aetheric-border rounded-xl mt-6">
              <div className="p-4 border-b border-aetheric-border flex justify-between items-center bg-[#0d0d0d] rounded-t-xl">
                 <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Active Annotations Log</div>
                 <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white">{currentSession.hallucinations.length}</span>
                    <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-tighter">Entities Found</span>
                 </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-gray-800 bg-[#0a0a0a]">
                         <th className="py-3 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest w-1/2">Segment</th>
                         <th className="py-3 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Status</th>
                         <th className="py-3 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Session ID</th>
                         <th className="py-3 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-800/30">
                      {currentSession.hallucinations.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-xs text-gray-600 italic">No annotations recorded for this session.</td>
                        </tr>
                      ) : (
                        currentSession.hallucinations.map(tag => (
                          <tr key={tag.id} className="hover:bg-white/5 transition group">
                            <td className="py-3 px-6 text-sm text-gray-300 font-serif">"{tag.selectedText}"</td>
                            <td className="py-3 px-6">
                                <span className={clsx(
                                  "px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider",
                                  tag.type === 'factual_error' ? "border-aetheric-red/40 bg-aetheric-red/10 text-aetheric-red" : "border-gray-700 bg-gray-800/50 text-gray-500"
                                )}>
                                  {tag.type.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-xs text-gray-600 font-mono">
                               OBJ-{tag.id.slice(0, 4)}
                            </td>
                            <td className="py-3 px-6 text-right">
                               <button onClick={() => removeTag(tag.id)} className="text-gray-600 hover:text-aetheric-red transition"><X size={14} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
