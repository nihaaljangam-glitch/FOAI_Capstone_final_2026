import React from 'react';
import { User, Mail, Shield, History, Award, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AccountPage() {
  const { sessions } = useApp();
  
  return (
    <div className="min-h-full p-8 flex flex-col max-w-4xl mx-auto">
      <div className="mb-12 flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-aetheric-pink to-indigo-600 p-1 shadow-[0_0_30px_rgba(224,75,245,0.3)]">
          <div className="w-full h-full rounded-2xl bg-aetheric-bg flex items-center justify-center">
            <User size={48} className="text-aetheric-pink" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1 text-white">Researcher Alpha</h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Researcher ID: AL-AX-9941</p>
          <div className="flex gap-4 mt-3">
             <div className="px-2 py-0.5 rounded border border-aetheric-pink/30 bg-aetheric-pink/5 text-[9px] font-bold text-aetheric-pink uppercase tracking-wider">Lead Analyst</div>
             <div className="px-2 py-0.5 rounded border border-gray-800 bg-gray-900/50 text-[9px] font-bold text-gray-500 uppercase tracking-wider">Pro Tier</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <section className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Identity Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-aetheric-pink" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Email Address</p>
                <p className="text-sm text-gray-200">alpha@aletheialens.ai</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={14} className="text-aetheric-pink" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Security Protocol</p>
                <p className="text-sm text-gray-200">2FA Biometric Lock</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-aetheric-panel border border-aetheric-border rounded-xl p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Activity metrics</h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <div className="flex items-center gap-2 mb-1">
                  <History size={12} className="text-aetheric-pink" />
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total Sessions</span>
                </div>
                <p className="text-2xl font-bold text-white">{sessions.length}</p>
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award size={12} className="text-aetheric-pink" />
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Tags Validated</span>
                </div>
                <p className="text-2xl font-bold text-white">1,242</p>
             </div>
          </div>
        </section>
      </div>

      <section className="bg-[#0f0f0f] border border-aetheric-border rounded-xl p-8 flex flex-col items-center text-center">
         <div className="w-16 h-16 rounded-full bg-aetheric-pink/10 flex items-center justify-center mb-6 relative overflow-hidden group">
            <Zap size={32} className="text-aetheric-pink relative z-10" />
            <div className="absolute inset-0 bg-aetheric-pink/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
         </div>
         <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Aetheric Insights Core</h3>
         <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
           Your account is currently synced with the Aletheia Lens Neural Network. 
           Validation history is cryptographically signed and stored locally in the environment.
         </p>
         
         <div className="flex gap-4">
           <button 
             onClick={() => window.location.reload()}
             className="px-8 py-3 bg-aetheric-pink rounded-lg text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(224,75,245,0.4)] transition"
           >
              Sync Laboratory
           </button>
           <button className="px-8 py-3 bg-white/5 border border-gray-800 rounded-lg text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition">
              Export ID Key
           </button>
         </div>
      </section>
    </div>
  );
}
