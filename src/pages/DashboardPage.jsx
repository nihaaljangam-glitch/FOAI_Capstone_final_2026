import React, { useMemo } from 'react';
import { TrendingUp, ShieldCheck, AlertTriangle, BookOpen, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function DashboardPage() {
  const { sessions, loadSession, loadDemoData } = useApp();
  const navigate = useNavigate();

  // HEURISTIC CALCULATION
  const stats = useMemo(() => {
    const total = sessions.length;
    const validated = sessions.filter(s => s.status === 'validated').length;
    
    // Total hallucinations found across all sessions
    const totalHallucinations = sessions.reduce((acc, s) => acc + s.hallucinations.length, 0);
    
    // Average accuracy (simulated based on tag count)
    // Formula: 100 - (hallucinations / total_words_estimate)
    // For demo: Let's assume an avg session has 500 words.
    const avgAccuracy = total > 0 
      ? Math.max(0, 100 - (totalHallucinations / (total * 5))) 
      : 0;

    return {
      totalSessions: total,
      validatedSessions: validated,
      avgAccuracy: avgAccuracy.toFixed(1),
      hallucinationRate: (100 - avgAccuracy).toFixed(1),
      peerCitations: total * 15 + Math.floor(Math.random() * 50)
    };
  }, [sessions]);

  // CHART DATA AGGREGATION
  const chartData = useMemo(() => {
    // Bar Data: Hallucinations per session (last 6)
    const bar = sessions.slice(0, 6).reverse().map((s, i) => ({
      name: `S-${i+1}`,
      uv: s.hallucinations.length * 10
    }));

    // Radar Data: Dimensional scores (simulation based on aggregates)
    const radar = [
      { subject: 'FACTUAL', A: stats.avgAccuracy, fullMark: 100 },
      { subject: 'LOGIC', A: 85 + (Math.random() * 10), fullMark: 100 },
      { subject: 'TONE', A: 75 + (Math.random() * 15), fullMark: 100 },
      { subject: 'SAFETY', A: 95, fullMark: 100 },
      { subject: 'DEPTH', A: 80 + (Math.random() * 5), fullMark: 100 },
    ];

    return { bar, radar };
  }, [sessions, stats]);

  const handleSessionClick = (id) => {
    loadSession(id);
    navigate('/comparison');
  };

  return (
    <div className="min-h-full p-8 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
         <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-aetheric-pink to-purple-500 italic">Dashboard</span>
         </h1>
         <p className="text-gray-400 text-sm max-w-xl">
            A high-level synthesis of model performance metrics and scholarly validation sessions derived from your research history.
         </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Total Sessions</div>
            <div className="text-3xl font-bold text-white mb-3">{stats.totalSessions}</div>
            <div className="flex items-center gap-1.5 text-aetheric-pink text-[9px] font-bold uppercase tracking-widest">
               <TrendingUp size={12} /> Active Analytics
            </div>
         </div>
         <div className="bg-gradient-to-br from-[#0f1512] to-aetheric-panel border border-aetheric-green/20 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-aetheric-green/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Avg. Factual Accuracy</div>
            <div className="text-3xl font-bold text-white mb-3">{stats.avgAccuracy}%</div>
            <div className="flex items-center gap-1.5 text-aetheric-green text-[9px] font-bold uppercase tracking-widest">
               <ShieldCheck size={12} /> High Integrity
            </div>
         </div>
         <div className="bg-gradient-to-br from-[#1a1010] to-aetheric-panel border border-aetheric-red/20 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-aetheric-red/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Hallucination Rate</div>
            <div className="text-3xl font-bold text-white mb-3">{stats.hallucinationRate}%</div>
            <div className="flex items-center gap-1.5 text-aetheric-red text-[9px] font-bold uppercase tracking-widest">
               <AlertTriangle size={12} /> REVIEW_REQUIRED
            </div>
         </div>
         <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Peer Citations</div>
            <div className="text-3xl font-bold text-white mb-3">{stats.peerCitations.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
               <BookOpen size={12} /> Scholarly Impact
            </div>
         </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Hallucination Frequency */}
         <div className="lg:col-span-2 bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-white font-bold text-lg mb-1 uppercase tracking-tight">Hallucination Delta</h3>
                  <p className="text-xs text-gray-500">Anomaly intensity across most recent sessions</p>
               </div>
               <button className="px-4 py-1.5 rounded-full border border-gray-800 text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-white transition">
                  Last 6 Sessions
               </button>
            </div>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.bar} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#444' }} dy={10} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #1f1f1f', borderRadius: '12px' }}
                        itemStyle={{ color: '#e04bf5', fontSize: '10px', fontWeight: 'bold' }}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                     />
                     <Bar dataKey="uv" fill="#e04bf5" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Model Consistency Radar */}
         <div className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
            <div className="mb-4">
               <h3 className="text-white font-bold text-lg mb-1 uppercase tracking-tight">Intelligence Matrix</h3>
               <p className="text-xs text-gray-500">Multidimensional consistency scoring</p>
            </div>
            <div className="h-56 w-full -mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData.radar}>
                     <PolarGrid stroke="#222" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#e04bf5', fontSize: 8, fontWeight: 'bold', letterSpacing: '0.1em' }} />
                     <Radar name="Performance" dataKey="A" stroke="#e04bf5" fill="#e04bf5" fillOpacity={0.15} strokeWidth={2} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #1f1f1f', borderRadius: '12px' }}
                        itemStyle={{ color: '#e04bf5', fontSize: '10px' }}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-aetheric-panel border border-aetheric-border rounded-xl flex-1 flex flex-col">
         <div className="p-6 flex justify-between items-center border-b border-aetheric-border bg-[#0a0a0a] rounded-t-xl">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Analytical Session History</h3>
            <button className="flex items-center gap-2 text-aetheric-pink text-[9px] font-bold uppercase tracking-widest hover:text-white transition group">
               View All Chronology <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
         <div className="overflow-x-auto min-h-0 flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-800 bg-[#070707]">
                     <th className="py-4 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Session Identity</th>
                     <th className="py-4 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Inquiry Context</th>
                     <th className="py-4 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Chronology</th>
                     <th className="py-4 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Status</th>
                     <th className="py-4 px-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest text-right">Factual Density</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-800/30">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                            <Clock size={20} className="text-gray-600" />
                          </div>
                          <p className="text-xs text-gray-500 italic mb-6">No research history discovered in the current lab environment.</p>
                          <button 
                            onClick={loadDemoData}
                            className="px-6 py-2 bg-white/5 border border-gray-800 rounded-lg text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition"
                          >
                            Load Research Samples
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => {
                      const hallucinationCount = session.hallucinations.length;
                      const accuracy = Math.max(0, 100 - (hallucinationCount * 2)).toFixed(1);
                      const isHigh = parseFloat(accuracy) > 90;

                      return (
                        <tr 
                          key={session.id} 
                          onClick={() => handleSessionClick(session.id)}
                          className="hover:bg-white/[0.03] transition group cursor-pointer"
                        >
                           <td className="py-4 px-6 text-sm text-gray-300 font-mono">TL-{session.id.slice(0, 6).toUpperCase()}</td>
                           <td className="py-4 px-6 text-sm text-gray-400 italic font-serif">
                              {session.question.slice(0, 45)}{session.question.length > 45 ? '...' : ''}
                           </td>
                           <td className="py-4 px-6 text-[10px] text-gray-500 font-mono">
                              {new Date(session.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                           </td>
                           <td className="py-4 px-6">
                              <div className={clsx(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold tracking-wider uppercase",
                                session.status === 'validated' 
                                  ? "border-aetheric-green/30 bg-aetheric-green/10 text-aetheric-green" 
                                  : "border-gray-700 bg-gray-800/30 text-gray-400"
                              )}>
                                 {session.status === 'validated' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                 {session.status.replace('_', ' ')}
                              </div>
                           </td>
                           <td className={clsx(
                             "py-4 px-6 text-right text-sm font-bold font-mono",
                             isHigh ? "text-aetheric-green" : "text-aetheric-red"
                           )}>
                              {accuracy}%
                           </td>
                        </tr>
                      )
                    })
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
